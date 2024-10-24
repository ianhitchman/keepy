import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import CreateNew from "./CreateNew";
import MasonryCards from "../../common/Masonry/MasonryCards";
import CardEditModal from "../../common/CardEditModal";
import { TagsData } from "../../../types/Card";
import { useFetchTags } from "../../../hooks/useFetchTags";
import { useFetchTasks, useUpdateTask } from "../../../hooks/useFetchTasks";
import { useFetchConfig, useUpdateConfig } from "../../../hooks/useFetchConfig";
import useParseIncomingTasks from "../../../hooks/useParseIncomingTasks";
import useStore from "../../../hooks/useStore";

const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchText = useStore((state) => state.searchText);
  const filterTags = useStore((state) => state.filterTags);
  const currentPage = useStore((state) => state.currentPage);

  const apiUrl = import.meta.env.VITE_API_URL;
  const pb = new PocketBase(`${apiUrl}/`);

  const { data: tags } = useFetchTags();
  const { data: tasks } = useFetchTasks();
  const { data: config } = useFetchConfig();

  const { mutate: saveConfig } = useUpdateConfig();
  const { mutate: saveTask } = useUpdateTask();

  useParseIncomingTasks(tasks, [
    tags,
    tasks,
    config,
    searchText,
    filterTags,
    currentPage,
  ]);

  const handleLogin = async (login: boolean = true) => {
    if (login) {
      await pb.collection("users").authWithPassword("admin", "admin1234");
    } else {
      await pb.authStore.clear();
    }
    setIsLoggedIn(pb.authStore.isValid);
  };

  const handleSave = (type: string, data: Record<string, any>) => {
    switch (type) {
      case "config":
        if (config?.id)
          saveConfig({
            id: config?.id,
            body: data,
          });
        break;
      case "task":
        const saveData = { ...data };
        if (saveData?.id) {
          if (saveData?.tags) {
            saveData.tags = saveData.tags.map((tag: TagsData | string) => {
              if (typeof tag === "string") return tag;
              return tag.id;
            });
          }
          saveTask({
            id: saveData?.id,
            body: saveData,
          });
        }
    }
  };

  useEffect(() => {
    setIsLoggedIn(pb.authStore.isValid);
  }, [pb.authStore.isValid]);

  return (
    <>
      {isLoggedIn && (
        <>
          <MasonryCards onSave={handleSave} />
          <CreateNew />
          {false && isLoggedIn && (
            <button onClick={() => handleLogin(false)}>Log out</button>
          )}
          <CardEditModal />
        </>
      )}
      {!isLoggedIn && (
        <div>
          Not logged in <button onClick={() => handleLogin(true)}>Login</button>
        </div>
      )}
    </>
  );
};

export default Home;
