import React from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link'

const Onboard = () => {
const vendorbtn = () =>{
   router.push('/authentication/register');

}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 via-blue-100 to-purple-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h2>
        <p className="text-gray-600 mb-6 text-lg">Register yourself as a Vendor or Customer</p>

        <div className="flex flex-col gap-4">
          <Link href='/authentication/register_v'>
            <button className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 transition duration-300">
              Register as Vendor
            </button>
            </Link>
            <Link href='/authentication/register'>
            <button className="w-full py-3 px-6 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:from-green-500 hover:to-teal-600 transition duration-300">
              Register as Customer
            </button>
            </Link>
        </div>
      </div>
    </div>
  )
}

export default Onboard
