import React from "react";
import { useAuth } from "../context/AuthContext";

const Welcome = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center gap-4 p-6 bg-black shadow rounded-2xl">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-500 text-white text-xl font-bold">
          ?
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">
            Welcome, Guest 👋
          </h2>
          <p className="text-white">Please login to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-6 bg-black shadow rounded-2xl">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-white text-xl font-bold">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">
          Welcome, {user.name} 👋
        </h2>
        <p className="text-white capitalize">{user.role}</p>
      </div>
    </div>
  );
};

export default Welcome;
