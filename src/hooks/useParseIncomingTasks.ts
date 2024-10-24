import { useState, useEffect } from "react";
import { TagsData, Card, CardData } from "../types/Card";
import { useFetchTags } from "../hooks/useFetchTags";
import { useFetchConfig } from "../hooks/useFetchConfig";
import useStore from "../hooks/useStore";

const useParseIncomingTasks = (tasks?: CardData[] | null, watch?: Array<any>, updateStore: boolean = true) => {

  const { data: tags } = useFetchTags();
  const { data: config } = useFetchConfig();
  const [isArchived, setIsArchived] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isReminders, setIsReminders] = useState(false);

  const currentPage = useStore((state) => state.currentPage);
  const searchText = useStore((state) => state.searchText);
  const filterTags = useStore((state) => state.filterTags);
  const setTasksData = useStore((state) => state.setTasksData);

  const [stateData, setStateData] = useState<Card[]>([]);

  const parseData = () => {
    const tagsData: TagsData[] = (tags || []).map((tag) => {
      const { id, description, colour } = tag;
      return {
        id,
        description,
        colour,
      };
    });
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
        ?.filter((card) =>
          isDeleted ? true : card?.isArchived === isArchived
        )
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
    return cardData;

  };

  useEffect(() => {
    setIsArchived(currentPage === "archive");
    setIsDeleted(currentPage === "deleted");
    setIsReminders(currentPage === "reminders");
  }, [currentPage]);

  useEffect(() => {
    const data = parseData();
    setStateData(data);
    if (updateStore) {
      setTasksData(data);
    }
  }, watch);

  return stateData;

}

export default useParseIncomingTasks;