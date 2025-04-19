"use client"
import { useForm } from 'react-hook-form';
import { signupSchema } from '@/lib/validation/signupSchema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/store/userStore';

type SignupForm = z.infer<typeof signupSchema>
type RegisterResponse = {
    user: {
        name: string;
        email: string;
    };
    message: string;
};


export default function SignUpPage() {
    const setUser = useUserStore((state) => state.setUser)

    const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema)
    })

    const onSubmit = async (data: SignupForm) => {
        console.log(data)
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
            const result: RegisterResponse = await response.json();
            if (response.ok) {
                setUser({ userName: result.user.name, email: result.user.email });
                alert("Signup successfull")
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            alert("Something goes wrong")
        }
    }
    return (
        <>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-black">Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            {...register('userName')}
                            className="w-full p-2 border rounded text-black"
                        />
                        {errors.userName && <p className="text-red-500">{errors.userName.message}</p>}
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            {...register('email')}
                            className="w-full p-2 border rounded text-black"
                        />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register('password')}
                            className="w-full p-2 border rounded text-black"
                        />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>

                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Sign Up
                    </button>
                </form>
            </div></>
    )
}