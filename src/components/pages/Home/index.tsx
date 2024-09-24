import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import CreateNew from "./CreateNew";
import MasonryCards from "../../common/Masonry/MasonryCards";
import { CardData, Card, TagsData } from "../../../types/Card";
import { useFetchTags } from "../../../hooks/useFetchTags";
import { useFetchTasks, useUpdateTask } from "../../../hooks/useFetchTasks";
import { useFetchConfig, useUpdateConfig } from "../../../hooks/useFetchConfig";
import useStore from "../../../hooks/useStore";

const Home: React.FC = () => {
  const [data, setData] = useState<Card[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isReminders, setIsReminders] = useState(false);
  const searchText = useStore((state) => state.searchText);
  const filterTags = useStore((state) => state.filterTags);
  const currentPage = useStore((state) => state.currentPage);
  const setIsTransitionsPaused = useStore(
    (state) => state.setIsTransitionsPaused
  );
  const apiUrl = import.meta.env.VITE_API_URL;
  const pb = new PocketBase(`${apiUrl}/`);

  const { data: tags } = useFetchTags();
  const { data: tasks } = useFetchTasks();
  const { data: config } = useFetchConfig();

  const { mutate: saveConfig } = useUpdateConfig();
  const { mutate: saveTask } = useUpdateTask();

  useEffect(() => {
    const fetchData = async () => {
      const tagsData: TagsData[] = (tags || []).map((tag) => {
        const { id, description, colour } = tag;
        return {
          id,
          description,
          colour,
        };
      });
      console.log(tasks);

      const cardData: Card[] =
        (tasks || [])
          .map((task: CardData) => {
            const {
              id,
              title,
              content,
              images,
              tags,
              reminderDate,
              isArchived,
              isDeleted,
              colour,
            } = task;
            const tagsItems: TagsData[] = tags
              ?.map((tag: string) => {
                const tagData = tagsData.find((t) => t.id === tag);
                if (!tagData) return null;
                return tagData;
              })
              ?.filter(Boolean) as TagsData[];
            const positionData = config?.taskPositions as Record<
              string,
              number
            >;
            const position = positionData?.[id] || 0;

            return {
              id,
              position: position || 0,
              title,
              content,
              images,
              tags: tagsItems,
              reminderDate,
              isArchived,
              isDeleted,
              colour,
            };
          })
          ?.filter((card) => card?.isArchived === isArchived)
          ?.filter((card) => card?.isDeleted === isDeleted)
          ?.filter((card) => {
            if (!isReminders) return true;
            return !!card?.reminderDate;
          })
          ?.filter((card) => {
            if (!searchText) return true;
            return (
              card?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
              card?.content?.toLowerCase().includes(searchText.toLowerCase())
            );
          })
          ?.filter((card) => {
            if (!filterTags || filterTags.length <= 0) return true;
            return card?.tags?.some((tag) => filterTags.includes(tag?.id));
          })
          ?.sort((a, b) => a?.position - b?.position) || [];

      setData(cardData);
    };
    // pause the card transitions if filters or data changes, to prevent them moving about all over the place
    setIsTransitionsPaused(true);
    fetchData();
  }, [
    tags,
    tasks,
    config,
    searchText,
    filterTags,
    isArchived,
    isDeleted,
    isReminders,
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
        if (data?.id) {
          saveTask({
            id: data?.id,
            body: data,
          });
        }
    }
  };

  useEffect(() => {
    setIsLoggedIn(pb.authStore.isValid);
  }, [pb.authStore.isValid]);

  useEffect(() => {
    setIsArchived(currentPage === "archive");
    setIsDeleted(currentPage === "deleted");
    setIsReminders(currentPage === "reminders");
  }, [currentPage]);

  return (
    <>
      {isLoggedIn && (
        <>
          <MasonryCards data={data} onSave={handleSave} />
          <CreateNew />
          {false && isLoggedIn && (
            <button onClick={() => handleLogin(false)}>Log out</button>
          )}
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
