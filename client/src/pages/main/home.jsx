import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export function Home() {
  return (
    <div>
      <Navbar currentPage={{ home: true }} />
      <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        <div className="sm:text-center lg:text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
            <span className="block xl:inline">Welcome to</span>{" "}
            <span className="block text-indigo-600 xl:inline">Tapaculo</span>
          </h1>
          <p className="text-center mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
            Tapaculo is a Survey api help you to make your own Surevy app like
            Google forms. We provide you a Graphical interface that helps you to
            mange your projects
          </p>
          <div className="mt-5 sm:mt-8 sm:flex justify-center">
            <div className="rounded-md shadow">
              <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                <Link to="/">Get started</Link>
              </a>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                <Link to="/">Live demo</Link>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
