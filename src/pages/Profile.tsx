// src/components/Profile.tsx
import React, { useState } from "react";
import { GearIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import * as Label from "@radix-ui/react-label";
import { Link } from "react-router-dom";

const Profile: React.FC = () => {
  const [grade, setGrade] = useState("2023级");
  const [major, setMajor] = useState("测绘");
  const [phone, setPhone] = useState("+8613806628888");
  const [qq, setQQ] = useState("2521373229");

  const gradeOptions = ["2020级", "2021级", "2022级", "2023级", "2024级"];
  const majorOptions = [
    "测绘",
    "计算机科学",
    "土木工程",
    "电子工程",
    "机械工程",
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white p-4 flex justify-end">
        <Link to={"/setting"}>
          <GearIcon className="h-6 w-6 text-gray-500" />
        </Link>
      </header>

      <div className="flex flex-col items-center mt-8">
        <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
        <h2 className="mt-4 text-xl font-bold">爱睡觉的南泽洋</h2>
        <p className="text-sm text-gray-500">{grade}|{major}</p>
        <div className="mt-2 text-sm text-gray-500">
          <p>{phone}</p>
          <p>{qq}</p>
        </div>
      </div>

      <div className="mt-8 mx-4 space-y-4">
        <div>
          <Label.Root
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="grade"
          >
            设置年级
          </Label.Root>
          <Select.Root value={grade} onValueChange={setGrade}>
            <Select.Trigger className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Select.Value placeholder="选择年级" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white border border-gray-300 rounded-md shadow-lg">
                <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  {gradeOptions.map((gradeOption) => (
                    <Select.Item
                      key={gradeOption}
                      value={gradeOption}
                      className="relative flex items-center h-[25px] px-[25px] text-[13px] leading-none text-gray-700 rounded-[3px] hover:bg-gray-100 focus:bg-gray-100 focus:outline-none select-none"
                    >
                      <Select.ItemText>{gradeOption}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div>
          <Label.Root
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="major"
          >
            设置专业
          </Label.Root>
          <Select.Root value={major} onValueChange={setMajor}>
            <Select.Trigger className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Select.Value placeholder="选择专业" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white border border-gray-300 rounded-md shadow-lg">
                <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  {majorOptions.map((majorOption) => (
                    <Select.Item
                      key={majorOption}
                      value={majorOption}
                      className="relative flex items-center h-[25px] px-[25px] text-[13px] leading-none text-gray-700 rounded-[3px] hover:bg-gray-100 focus:bg-gray-100 focus:outline-none select-none"
                    >
                      <Select.ItemText>{majorOption}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div>
          <Label.Root
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="phone"
          >
            设置电话号码
          </Label.Root>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            placeholder="输入电话号码"
          />
        </div>

        <div>
          <Label.Root
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="qq"
          >
            设置QQ号
          </Label.Root>
          <input
            type="text"
            id="qq"
            value={qq}
            onChange={(e) => setQQ(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            placeholder="输入QQ号"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
