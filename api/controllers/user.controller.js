import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
export const getUsers = async (req, res) => {

    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get user" })
    }
}
export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get user" })
    }
}
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;


    const { password, avatar, ...inputs } = req.body;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "not authorised" })
    }

    let updatedPassword = null;
    try {

        if (password) {
            updatedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updatedPassword && { password: updatedPassword }),
                ...(avatar && { avatar }),
            }

        });

        const { password: userPass, ...rest } = updatedUser

        res.status(200).json(inputs);


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get user" })
    }
};
export const deleteUSer = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    if (id != tokenUserId) {
        return res.status(403).json({ message: "not authorised" })
    }
    try {
        await prisma.user.delete({
            where: {
                id
            }
        })
        res.status(200).json({ message: "Deleted successfully" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get user" })
    }
}
export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;

    try {
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId: tokenUserId,
                postId,
            },
        });
        if (savedPost) {
            await prisma.savedPost.delete({
                where: {
                    id: savedPost.id,
                }
            })

            res.status(200).json({ message: "Post Removed from saved List" })
        }
        else {
            await prisma.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId,
                }
            })

            res.status(200).json({ message: "Post saved" })
        }




        res.status(200).json({ message: "Deleted successfully" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get user" })
    }
}