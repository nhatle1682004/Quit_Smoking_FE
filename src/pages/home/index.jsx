import React from "react";
import { useSelector } from "react-redux";

function HomePage() {
  const user = useSelector((state) => state.user);



  return (
    <div>
      <h1>Hello {user?.fullName}!</h1>
    </div>
  );
}

export default HomePage;
