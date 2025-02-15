import { useState } from "react";
import { useItemsActions } from "../hooks/useItemsActions";
import { Button, Card, CardBody, CardFooter, Chip, Input, Tab, Tabs, TabsHeader, Typography } from "@material-tailwind/react";
import GlassButton from "../assets/GlassButton";
import XMark from "../assets/XMark";
import CheckBadge from "../assets/CheckBadge";
import { Link } from "react-router-dom";
import { PreferenceModal } from "../components/container/PreferenceModal";
import { useUsersActions } from "../hooks/useUsersActions";
import { Item } from "../models/types";

export const data = [
  { value: "Platos", },
  { value: "Entradas", },
  { value: "Bebidas", },
  { value: "Postres", },
];

export default function MenuPage() {
  const { items  } = useItemsActions()
  const { myUser, useSetUserPreferences } = useUsersActions()
  const [filter, setFilter] = useState<string>("");
  const [category, setCategory] = useState<string>("Platos");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const getFilteredItems = () => {
    return items
      .filter((item: Item) =>
        (item.category === category) &&
        (item.name.toLowerCase().includes(filter.toLowerCase()) ||
          item.description.toLowerCase().includes(filter.toLowerCase()) ||
          item.keywords.some((keyword: String) => keyword.toLowerCase().includes(filter.toLowerCase()))) &&
        (!myUser.preferences.some((preference: string) =>
          item.ingredients.some(ingredient => ingredient.toLowerCase().includes(preference.toLowerCase()))))
      )
    };

  const deletePreference = (preference: string) => {
    useSetUserPreferences({...myUser, preferences: myUser.preferences.filter((value: string) => value !== preference)})
  }

  return (
    <div className="min-h-full min-w-full flex flex-col items-center pt-[4.37rem] pb-[6.5rem]">
      <div className="flex min-w-[90%] items-center place-content-center pt-5 gap-3">
        <div className="relative flex w-full max-w-[91.1%]">
          <Input crossOrigin="false" name="search" type="text" label="Buscar" placeholder="Buscar" value={filter} onChange={handleChange} className="pr-20" containerProps={{ className: "min-w-0" }} />
          <GlassButton />
        </div>
        <PreferenceModal />
      </div>
      <div className="min-w-[90%] max-w-[90%] flex pt-4 gap-2 pb-6 overflow-x-scroll">
        {myUser.preferences.map((preference: string, index: number) => (
          <Chip key={index} variant="outlined" 
            icon={
              <Button onClick={() => deletePreference(preference)} variant="text" className="p-0 rounded-none bg-white text-black">
                <XMark />
              </Button>
          } value={preference} 
            className="capitalize"
          />
        ))}
      </div>
      <Tabs value={category} className="min-h-[4rem] min-w-full pl-[5%]">
        <TabsHeader>
          {data.map(({ value }) => (
            <Tab key={value} value={value} className="min-h-[2.5rem]" onClick={() => setCategory(value)} >
              {value}
            </Tab>
          ))}
          </TabsHeader>
        </Tabs>
      <div className="flex flex-col min-w-[90%] items-center place-content-center">
        <div className="min-w-full flex flex-col gap-5">
          {getFilteredItems().map((item, index) => (
            <Card key={index} className="">
              <Link to={`/product/`.concat(item.item_id)} >
              <CardBody className="pb-2">
                <div className="pb-3 flex justify-between">
                  <div className="">
                    <Typography variant="h6" className="font-semibold text-black">{item.name}</Typography>
                    <Typography variant="small" className="font-medium text-blue-gray-500">Para {item.portion} persona(s)</Typography>
                  </div>
                  <Typography variant="h5" className="text-black">$ {item.price.toFixed(2)}</Typography>
                </div>
                <Typography variant="small" className="text-[#607D8B]">{item.description}</Typography>
              </CardBody>
              <CardFooter className="flex gap-4 pt-0">
                {item.keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center gap-[0.2rem]">
                    <CheckBadge/><Typography variant="small" className="capitalize">{keyword}</Typography>
                  </div>
                ))}
              </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
