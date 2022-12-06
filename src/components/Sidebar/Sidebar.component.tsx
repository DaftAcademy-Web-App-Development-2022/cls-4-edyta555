import React from "react";
import { signOut } from "next-auth/react";

import { Form, User } from "../index";
import styles from "./Sidebar.module.css";

import userData from "~/data/userData.json";
import useSpotify from "~/hooks/useSpotify.hook";

const Sidebar = () => {
  const handleLogout = (name: string, id: string) => {
    signOut();
  };

  const { me } = useSpotify();

  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <User
          logout={() => handleLogout(userData.name, userData.id)}
          email={me?.email || ""}
          name={me?.display_name || ""}
          image={me?.images?.[0]?.url || ""}
          loading={false}
        />
      </div>
      <div className={styles.center}>
        <Form />
      </div>
    </div>
  );
};

export default Sidebar;
