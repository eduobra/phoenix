"use client";
import React from "react";

const apps = [
  {
    name: "Booking.com",
    image: "/public/img/Booking.com_Icon_2022.svg",
  },
  {
    name: "Canva",
    image: "/public/img/canva.svg",
  },
  {
    name: "Coursera",
    image: "/apps/coursera.png",
  },
  {
    name: "Figma",
    image: "/apps/figma.png",
  },
  {
    name: "Spotify",
    image: "/apps/spotify.png",
  },
];

export default function AppsConnectorsContent() {
  return (
    <div className="space-y-4 text-gray-800">
      {/* Header */}
      <p className="text-sm text-gray-600">
        Connect apps so you can talk to them with visual and interactive experiences in Ascent AI.{" "}
        <a href="#" className="text-blue-600 hover:underline">Learn more.</a>
      </p>

      {/* App Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {apps.map((app) => (
          <div
            key={app.name}
            className="flex flex-col items-center p-4 border rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-white"
            title={app.name}
          >
            <img
              src={app.image}
              alt={app.name}
              className="w-16 h-16 object-contain rounded-lg mb-2"
            />
            <span className="text-sm font-medium text-gray-800">{app.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
