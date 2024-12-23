import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { authApi } from "../api/auth";

const AuthPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.grecaptcha?.ready(() => {
      console.log('ReCaptcha is ready');
    });
  }, []);

  const handleSendCode = async () => {
    if (!/^1\d{10}$/.test(phoneNumber)) {
      setPhoneError("请输入正确的11位手机号码");
      return;
    }
    setPhoneError("");
    
    try {
      setIsLoading(true);
      await authApi.sendCode({ phone: phoneNumber });
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      if (error.response) {
        setPhoneError(error.response.data?.error || "发送验证码失败，请稍后重试");
      } else {
        setPhoneError("网络错误，请检查网络连接");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await authApi.loginOrRegister({
        phone: phoneNumber,
        code: verificationCode,
      });
      
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/home');
      } else {
        setPhoneError("登录失败：未收到有效的用户信息");
      }
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setPhoneError("请求参数错误，请检查手机号和验证码");
            break;
          case 401:
            setPhoneError("验证码错误或已过期");
            break;
          case 429:
            setPhoneError("登录尝试次数过多，请稍后再试");
            break;
          default:
            setPhoneError(error.response.data?.error || "登录失败，请稍后重试");
        }
      } else if (error.request) {
        setPhoneError("网络错误，请检查网络连接");
      } else {
        setPhoneError("登录失败，请稍后重试");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen p-4 bg-white">
      <BackButton to="/home"/>
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
              disabled={countdown > 0 || isLoading}
              className={`bg-gray-200 text-gray-700 px-2 border border-gray-300 absolute right-2 top-[50%] translate-y-[-50%] ${
                (countdown > 0 || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {countdown > 0 ? `${countdown}秒后重试` : '点击发送验证码'}
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
            className="w-full bg-black text-white p-3 rounded-md font-medium disabled:opacity-50"
            disabled={!isAgreed || isLoading}
          >
            {isLoading ? '处理中...' : '登录/自动注册'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
