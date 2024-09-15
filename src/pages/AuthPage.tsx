import React, { useState } from "react";
import { Link } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const handleSendCode = () => {
    // Validate phone number
    if (!/^1\d{10}$/.test(phoneNumber)) {
      setPhoneError("请输入正确的11位手机号码");
      return;
    }
    setPhoneError("");
    // TODO: Implement sending verification code
    console.log("Sending verification code to", phoneNumber);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login/registration logic
    console.log("Submitting", { phoneNumber, verificationCode });
  };

  return (
    <div className="flex flex-col justify-center min-h-screen p-4 bg-white">
      <div className="max-w-sm mx-auto w-full">
        <h1 className="text-2xl font-bold mb-2">手机号登陆注册</h1>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-1">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 11));
                setPhoneError("");
              }}
              placeholder="请输入手机号"
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
            {phoneNumber && (
              <button
                type="button"
                onClick={() => {
                  setPhoneNumber("");
                  setPhoneError("");
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                ×
              </button>
            )}
          </div>
          {phoneError && (
            <p className="text-red-500 text-sm mb-1">{phoneError}</p>
          )}
          <div className="flex mb-1 relative">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(
                  e.target.value.replace(/\D/g, "").slice(0, 6),
                )}
              placeholder="请输入验证码"
              className="flex-grow p-3 border border-gray-300 rounded-l-md"
              required
            />
            <button
              type="button"
              onClick={handleSendCode}
              className="bg-gray-200 text-gray-700 px-2 border border-gray-300 absolute right-2 top-[50%] translate-y-[-50%]"
            >
              点击发送验证码
            </button>
          </div>
          <div className="flex items-center mb-16">
            <input
              type="checkbox"
              id="agreement"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className="mr-2 rounded-full"
            />
            <label htmlFor="agreement" className="text-sm text-gray-600">
              我已阅读并同意{" "}
              <Link to="/declaration" className="text-blue-500 hover:underline">
                《交大喷泉二手书使用声明》
              </Link>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-md font-medium"
            disabled={!isAgreed}
          >
            登录/自动注册
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
