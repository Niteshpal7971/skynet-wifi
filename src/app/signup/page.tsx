"use client"
import { useForm } from 'react-hook-form';
import { signupSchema } from '@/lib/validation/userSchema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

type SignupForm = z.infer<typeof signupSchema>
type RegisterResponse = {
    User: {
        userName: string;
        email: string;
    };
    message: string;
};


export default function SignUpPage() {

    const router = useRouter();
    const setUser = useUserStore((state) => state.setUser);

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
            console.log("result", result);
            if (response.ok) {
                setUser({ userName: result.User.userName, email: result.User.email });
                alert("Signup successful. Please check your email to verify your account.")
            } else {
                console.log("else result errror")
                alert(result.message || "Something goes wrong");
            }
        } catch (error) {
            console.error(error);
            alert("Something goes wrong")
        }
    }
    return (
        <>
            <main className='min-h-screen flex justify-center items-center'>
                <section className="w-1/4 flex flex-col justify-center items-center bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-2xl text-center font-bold mb-4 text-black">Create an account</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 flex flex-col items-center">
                        <div className='w-full'>
                            <label className='sr-only' htmlFor="userName">Name</label>
                            <input
                                type="text"
                                id='userName'
                                placeholder="Name"
                                {...register('userName')}
                                className="w-full p-2 border rounded text-black"
                            />
                            {errors.userName && <p className="text-red-500">{errors.userName.message}</p>}
                        </div>

                        <div className='w-full'>
                            <label className='sr-only' htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                {...register('email')}
                                className="w-full p-2 border rounded text-black"
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className='w-full'>
                            <label className='sr-only' htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                {...register('password')}
                                className="w-full p-2 border rounded text-black"
                            />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>

                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                            Sign Up
                        </button>
                        <p className='text-center text-black'>
                            Already have an acoount?
                            <span className='text-blue-500 cursor-pointer hover:underline' onClick={() => router.push('./login')}>Login</span>
                        </p>
                    </form>
                </section>
            </main>
        </>
    )
}