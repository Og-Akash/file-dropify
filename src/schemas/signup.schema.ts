import * as z from "zod";

export const signUpSchema = z.object({
    username: z
        .string()
        .min(3, { message: "username must be more tha 3 charactors" }),
    email: z
        .string()
        .min(1, { message: "email is required" })
        .email({ message: "Please enter a valid email" }),
    password: z
        .string()
        .min(1, { message: "Password is required." })
        .min(6, { message: "Password must be more than 6 charactors" })
        .max(20, { message: "Password must be less tham 20 charactors" }),
    passwordConfirmation: z
        .string()
        .min(1, { message: "Please confirm your Password" }),
})
.refine((data) => data.password === data.passwordConfirmation,{
    message: "Password does not match.",
    path: ["passwordConfirmation"]
});
