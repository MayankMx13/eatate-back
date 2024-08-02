import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";




export const register = async (req, res) => {

    try {

        const { username, email, password } = req.body;
        console.log(req.body)
        // HASH THE PASSWORD
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(hashedPassword);

        // CREATE NEW USER AND SAVE TO THE DATABASE
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        console.log(newUser);
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Failed to create" });

    }
}
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        //CHECK IF USER EXITSS OR NOT 
        const user = await prisma.user.findUnique({
            where: { username: username }
        })

        //IF PASS IS CORRECT 
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });
        //GENERATE COOKIE TOKEN AND SEND TO THE USER
        // res.setHeader("set-cookie", "test=" + "myValue").json("success")
        const age = 1000 * 60 * 60 * 24 * 7

        const token = jwt.sign({
            id: user.id,
            isAdmin: true,
        }, process.env.JWT_SECRET_KEY, { expiresIn: age });

        const { password: userPassword, ...userInfo } = user

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: age,
        }).status(200).json(userInfo);
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "Failed to login" })
    }

}
export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" })


}