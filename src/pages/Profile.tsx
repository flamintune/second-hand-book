// src/components/Profile.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GearIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import * as Label from "@radix-ui/react-label";
import { Link } from "react-router-dom";
import { User, userApi } from "../api/user";
import { useDebounce } from "../hooks/useDebounce";
import { debounce } from "lodash";

const connectionTypeOptions = ["QQ", "微信", "电话"];

// 修改年级映射关系
const GRADE_MAP = {
  "1": "大一",
  "2": "大二",
  "3": "大三",
  "4": "大四",
} as const;

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [majors, setMajors] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 修改年级选项
  const gradeOptions = [
    { value: "1", label: "大一" },
    { value: "2", label: "大二" },
    { value: "3", label: "大三" },
    { value: "4", label: "大四" },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError("");
        // 从 localStorage 获���用户 ID
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const userId = JSON.parse(storedUser).id;
        const [userResponse] = await Promise.all([
          userApi.getUser(userId),
        ]);

        // 设置默认值
        const userData = userResponse.user;
        if (!userData.nickname) {
          userData.nickname = `交友${userData.id}号`;
        }
        if (!userData.grade) {
          userData.grade = "1"; // 默认为大一
        }
        setUser(userData);
      } catch (err: any) {
        setError(err.response?.data?.error || "获取用户信息失败");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setUser((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleSelectChange = async (field: string, value: string | number) => {
    if (!user) return;

    try {
      setError("");
      // 先更新 UI
      setUser((prev) => prev ? { ...prev, [field]: value } : null);

      const updateData: UpdateUserRequest = {
        nickname: user.nickname,
        grade: user.grade,
        majorId: user.majorId,
        connection: user.connection,
        connection_type: user.connection_type,
        [field]: value,
      };

      await userApi.updateUser(user.id, updateData);
    } catch (err: any) {
      setError(err.response?.data?.error || "更新失败");
      // 更新失败时回滚到原始值
      setUser((prev) => prev);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex justify-center items-center h-screen">加载中...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-4">未找到用户信息</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white p-4 flex justify-end">
        <Link to="/setting">
          <GearIcon className="h-6 w-6 text-gray-500" />
        </Link>
      </header>

      <div className="flex flex-col items-center mt-8">
        {/* <div className="w-24 h-24 bg-gray-300 rounded-full"></div> */}
        <h2 className="mt-4 text-xl font-bold max-w-[200px] truncate">
          {user.nickname}
        </h2>
        <p className="text-sm text-gray-500">
          {user.grade
            ? GRADE_MAP[user.grade as keyof typeof GRADE_MAP]
            : "未设置年级"} |{" "}
          {majors.find((m) => m.id === user.majorId)?.name || "未设置专业"}
        </p>
        <div className="mt-2 text-sm text-gray-500">
          <p>{user.phone_number_with_mask}</p>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <p>
            {user.connection && user.connection_type
              ? `${
                connectionTypeOptions[user.connection_type - 1]
              }: ${user.connection}`
              : ""}
          </p>
        </div>
      </div>

      <div className="mt-8 mx-4 space-y-4">
        <div>
          <Label.Root className="block text-sm font-medium text-gray-700 mb-1">
            设置昵称
          </Label.Root>
          <input
            type="text"
            value={user.nickname || ""}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
            onBlur={(e) => handleSelectChange("nickname", e.target.value)}
            maxLength={15}
            className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            placeholder="输入昵称"
          />
        </div>

        <div>
          <Label.Root className="block text-sm font-medium text-gray-700 mb-1">
            设置联系方式
          </Label.Root>
          <input
            type="text"
            value={user.connection || ""}
            onChange={(e) => handleInputChange("connection", e.target.value)}
            onBlur={(e) => handleSelectChange("connection", e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            placeholder="输入联系方式"
          />
        </div>

        <div>
          <Label.Root className="block text-sm font-medium text-gray-700 mb-1">
            设置年级
          </Label.Root>
          <Select.Root
            value={user.grade || ""}
            onValueChange={(value) => handleSelectChange("grade", value)}
          >
            <Select.Trigger className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Select.Value placeholder="选择年级" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white border border-gray-300 rounded-md shadow-lg">
                <Select.Viewport className="p-1">
                  {gradeOptions.map((grade) => (
                    <Select.Item
                      key={grade.value}
                      value={grade.value}
                      className="relative flex items-center h-[25px] px-[25px] text-[13px] leading-none text-gray-700 rounded-[3px] hover:bg-gray-100 focus:bg-gray-100 focus:outline-none select-none"
                    >
                      <Select.ItemText>{grade.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div>
          <Label.Root className="block text-sm font-medium text-gray-700 mb-1">
            设置专业
          </Label.Root>
          <Select.Root
            value={String(user.majorId || "")}
            onValueChange={(value) =>
              handleSelectChange("majorId", parseInt(value))}
          >
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
                  {majors.map((major) => (
                    <Select.Item
                      key={major.id}
                      value={String(major.id)}
                      className="relative flex items-center h-[25px] px-[25px] text-[13px] leading-none text-gray-700 rounded-[3px] hover:bg-gray-100 focus:bg-gray-100 focus:outline-none select-none"
                    >
                      <Select.ItemText>{major.name}</Select.ItemText>
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
          <Label.Root className="block text-sm font-medium text-gray-700 mb-1">
            设置联系方式类型
          </Label.Root>
          <Select.Root
            value={user.connection_type || ""}
            onValueChange={(value) =>
              handleSelectChange("connection_type", value)}
          >
            <Select.Trigger className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Select.Value placeholder="选择联系方式类型" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white border border-gray-300 rounded-md shadow-lg">
                <Select.Viewport className="p-1">
                  {connectionTypeOptions.map((type, index) => (
                    <Select.Item
                      key={type}
                      value={index + 1}
                      className="relative flex items-center h-[25px] px-[25px] text-[13px] leading-none text-gray-700 rounded-[3px] hover:bg-gray-100 focus:bg-gray-100 focus:outline-none select-none"
                    >
                      <Select.ItemText>{type}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>
    </div>
  );
};

export default Profile;
