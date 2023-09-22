// import React from 'react';
import Header from "../components/Header";

function Admin() {
  return (
    <div
      className="w-4/5 h-screen bg-black flex flex-col py-2
    gap-y-2 pr-2"
    >
      <Header className="rounded-lg">
        <div className="mb-2 text-center">
          <h1
            className="
                text-3xl
                font-semibold
                text-white
                "
          >
            Admin Page
          </h1>
          <div
            className="
                gird
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-4
                gap-3
                mt-4
              "
          >
            <p>Admin header goes here</p>
          </div>
        </div>
      </Header>
    </div>
  );
}

export default Admin;
