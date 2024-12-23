import React, { useEffect, useMemo, useState } from "react";
import { GearIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import {
  ChevronDownIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import * as Label from "@radix-ui/react-label";
import { Link } from "react-router-dom";
import { type Major, UpdateUserRequest, User, userApi } from "../api/user";
import { MAJORS } from "../constants/majors";
import * as Dialog from "@radix-ui/react-dialog";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [majorSearch, setMajorSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);

  // 修改年级选项
  const gradeOptions = [
    { value: "1", label: "大一" },
    { value: "2", label: "大二" },
    { value: "3", label: "大三" },
    { value: "4", label: "大四" },
  ];

  // 直接使用 MAJORS 进行过滤
  const filteredMajors = useMemo(() => {
    return MAJORS.filter((major) =>
      major.name.toLowerCase().includes(majorSearch.toLowerCase())
    );
  }, [majorSearch]);

  // 获取当前专业名称的函数
  const getCurrentMajorName = useMemo(() => {
    if (!user?.major_id) return "";
    return selectedMajor?.national_name || "";
  }, [user?.major_id, selectedMajor]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError("");
        // 从 localStorage 获取用户 ID
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
        major_id: user.major_id,
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

  // 处理专业选择
  const handleMajorSelect = async (majorName: string) => {
    try {
      const response = await userApi.getMajorByName(majorName);
      if (response.majors.length > 0) {
        const major = response.majors[0];
        setSelectedMajor(major);
        handleSelectChange("major_id", major.id);
      }
      setMajorSearch("");
      setDrawerOpen(false);
    } catch (err) {
      console.error("获取专业信息失败:", err);
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
            : "未设置年级"} | {getCurrentMajorName || "未设置专业"}
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
          <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
            <Dialog.Trigger asChild>
              <button className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="truncate">
                  {getCurrentMajorName || "选择专业"}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/30" />
              <Dialog.Content className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white rounded-t-xl p-4 shadow-xl focus:outline-none">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-medium">
                    选择专业
                  </Dialog.Title>
                  <Dialog.Close className="rounded-full p-1 hover:bg-gray-100">
                    <Cross2Icon className="h-4 w-4" />
                  </Dialog.Close>
                </div>

                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent"
                    placeholder="搜索专业..."
                    value={majorSearch}
                    onChange={(e) => setMajorSearch(e.target.value)}
                  />
                </div>

                <div className="overflow-y-auto h-[calc(100%-120px)]">
                  {filteredMajors.length > 0
                    ? (
                      <div className="space-y-1">
                        {filteredMajors.map((major) => (
                          <button
                            key={major.name}
                            className={`w-full px-4 py-3 text-left text-sm rounded-md transition-colors
                            ${
                              selectedMajor?.national_name === major.name
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => handleMajorSelect(major.name)}
                          >
                            {major.name}
                          </button>
                        ))}
                      </div>
                    )
                    : (
                      <div className="text-center text-sm text-gray-500 py-4">
                        未找到匹配的专业
                      </div>
                    )}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <div>
          <Label.Root className="block text-sm font-medium text-gray-700 mb-1">
            设置联系方式类型
          </Label.Root>
          <Select.Root
            value={user.connection_type?.toString() || ""}
            onValueChange={(value) =>
              handleSelectChange("connection_type", parseInt(value))}
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
                      value={(index + 1).toString()}
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
