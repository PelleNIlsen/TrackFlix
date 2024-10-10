import React from "react";

export function Footer() {
  return (
    <div className="bg-[#0c0c0c] rounded-xl mt-8 p-6">
      <div className="flex flex-col sm:flex-row gap-y-4 justify-between">
        <a className="text-4xl font-bold flex items-center mx-auto" href="/">
          <img src="assets/TrackFlix.png" alt="logo" className="w-16 h-16" />
          TrackFlix
        </a>
        <a
          href="https://www.buymeacoffee.com/pellemartinius"
          target="_blank"
          rel="noreferrer"
          className="mx-auto"
        >
          <img
            src="https://img.buymeacoffee.com/button-api/?text=Support me&emoji=&slug=pellemartinius&button_colour=000000&font_colour=ffffff&font_family=Cookie&outline_colour=ffffff&coffee_colour=FFDD00"
            alt="Support me"
          />
        </a>
        <a className="text-sm font-bold flex flex-col items-center" href="#">
          <img
            src="assets/github-mark-white.png"
            alt="logo"
            className="w-8 h-8"
          />
          View source code
        </a>
      </div>
    </div>
  );
}
