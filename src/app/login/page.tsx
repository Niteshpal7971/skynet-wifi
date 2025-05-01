"use client"
import { useForm } from 'react-hook-form';
import { loginSchema } from '@/lib/validation/userSchema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

type loginForm = z.infer<typeof loginSchema>

type LoginResponse = {
    user: {
        userName: string;
        email: string;
    };
    message: string;
};

const Login = () => {

    const router = useRouter();
    const setUser = useUserStore((state) => state.setUser);
    const { register, handleSubmit, formState: { errors } } = useForm<loginForm>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: loginForm) => {
        // console.log(data);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'ContentType': 'application/json' }
            });

            const result: LoginResponse = await response.json();
            console.log("result:", result)
            if (response.ok) {
                setUser({ userName: result.user.userName, email: result.user.email });
                alert("Signup successfull");
                router.push('/dashboard')
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
            <main className='min-h-screen flex justify-center items-center'>
                <section className="w-1/4 flex flex-col justify-center items-center p-8 bg-white rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-center text-black">Log in</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-4 flex flex-col items-center'>
                        <div className='w-full'>
                            <label className="sr-only" htmlFor="email">Email</label>
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
                            <label className="sr-only" htmlFor="password">Email</label>
                            <input
                                type="password"
                                id="password"
                                placeholder='Password'
                                {...register('password')}
                                className="w-full p-2 border rounded text-black"
                            />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>

                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                            Login
                        </button>
                        <p className='text-center text-black'>
                            Don&apos;t have an acoount?
                            <span className='text-blue-500 cursor-pointer hover:underline' onClick={() => router.push('./signup')}>signup</span>
                        </p>
                    </form>
                </section>
            </main>
        </>
    );

}

export default Login;
