import React, { useState } from "react";
import { currencies } from "../constants/currencies";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { settings } from "../constants/settings";
import { CircleX } from "lucide-react";

export function Header({
  currency,
  setCurrency,
  totalMonthlySpend,
  totalPaidAllTime,
  onOpenSpendingModal,
}) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [profileOptions, setProfileOptions] = useState(false);
  const [settingsView, setSettingsView] = useState(false);

  const handleSettingAction = (action) => {
    switch (action) {
      case "toggleSettings":
        setSettingsView(!settingsView);
        break;
      case "signOut":
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  return (
    <header className="bg-background p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <img
              src="/assets/TrackFlix.png"
              alt="logo"
              className="w-10 h-10 md:w-12 md:h-12 mr-2"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              TrackFlix
            </h1>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <select
              value={currency.code}
              onChange={(e) =>
                setCurrency(
                  currencies.find((c) => c.code === e.target.value) ||
                    currencies[0]
                )
              }
              className=" bg-white text-black text-primary rounded-lg p-2 text-sm md:text-base"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
            <div className="text-center md:text-right">
              <button
                onClick={onOpenSpendingModal}
                className="text-base md:text-lg font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                Monthly spend: {currency.symbol}
                {totalMonthlySpend.toFixed(2)}
              </button>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">
                Total paid all time: {currency.symbol}
                {totalPaidAllTime.toFixed(2)}
              </div>
            </div>
          </div>
          {isLoaded && (
            <div className="mt-2 md:mt-0">
              {isSignedIn ? (
                <>
                  <img
                    src={user.imageUrl}
                    alt={`${user.firstName}'s pfp`}
                    className="object-cover w-14 rounded-full hover:ring-4 cursor-pointer"
                    onClick={() => setProfileOptions(!profileOptions)}
                  />
                  {profileOptions && (
                    <div className="bg-[#1d1d1d] p-6 rounded-lg absolute mt-2 -translate-x-1/4 text-left">
                      {settings.map((setting) => (
                        <React.Fragment key={setting.id}>
                          {setting.extra === "hr" ? (
                            <hr className="my-2 border-border" />
                          ) : setting.text === "Sign out" ? (
                            <SignOutButton className="bg-red-500 px-4 py-2 rounded-lg">
                              Sign out
                            </SignOutButton>
                          ) : (
                            <button
                              onClick={() =>
                                handleSettingAction(setting.action)
                              }
                              className="my-2 hover:font-semibold"
                            >
                              {setting.text}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href="/login"
                  className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  Sign in
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {settingsView && (
        <div className="absolute top-0 left-0 min-w-full min-h-full overflow-hidden z-[999] backdrop-blur-sm flex justify-center">
          <div className="bg-black h-fit p-10 rounded-xl w-[40rem] my-auto">
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <img
                  src={user.imageUrl}
                  alt={user.fullName}
                  className="h-12 rounded-full"
                />
                <h1 className="text-2xl my-auto">Hello, {user.firstName}</h1>
              </div>
              <CircleX
                size={32}
                className="my-auto text-red-500 cursor-pointer"
                onClick={() => setSettingsView(!settingsView)}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
