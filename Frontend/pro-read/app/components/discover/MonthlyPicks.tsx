// components/MonthlyPicks.tsx
import React from "react";
import { Button } from "../ui/Button";
import { ArrowRight } from "lucide-react";

const books = [
  {
    title: "Visions of Reality",
    author: "Elena Thorpe",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYzItvDU9p0nFVjkAX44ToaF5m86XO0BpRGci0Pb8slJf6535O8fryIYwFPS9EYMeHn5Gty4J6UN77_9YHLF6f_Khnv34jwdbugBstPlaXKOfiNVBrGB1vKpz51z2prvitjZLm115IbnByZy6NQPV5xaDPor8csZI9rDOgOEQJplVR0Y_wjjzDe8lrf-vi47DXyh7uRKGbCtukElOPbCP6J9Sb8VzUpot7L4BKxa29KDVBlqHHKyfY5kD_Ia9DLikvRemF8d0jusjt",
  },
  {
    title: "The Silent Stoic",
    author: "Marcus Valerius",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDunjDd6FO1hiMLjQU5HmOo6QbZkLBXu-6DJLUAU40TC_qKEdM_-JtQpsm7igLwzEbik-lwWbcqLX1QerQZJSTiljeDiAmCdv8zMh75v6tSunGOGCK-Veap5QSophRoXko0kAPlYJdZpO3qj30cRgKdmDU8iaNmBE8Yrr2lnX9sbap7DrOooz_Ujs80lP500uEEyUmnA7TEg1tNT6z91_ol_MqU5NBLy1vfdqs_uc2DtjNSGOmd4eET65q8nrgSWYxVTboLfl4F3TaL",
  },
  {
    title: "Echoes in Velvet",
    author: "Isabella Vance",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAes3KNTi-Iz9Ij1qAlCxyDIaMlyzIJvMMbLmsCp3egiX_MKcCQw-AlFMjgIgJ_ByDLJwX91LeuPbml0Am3Mp-dNGVGtnHXFE5nLa_NZLdVapOrbEhPOvnrEZiPxeP-bHfR4jzQOKDei1OJkefFZZKys3rdTSFxJadDCQxzOebaIJgLRuPX7uMJ4mIIbnUi7IFbgV2rp6tKgrmLfLtSSHP4S-wWk5wxUyqvLf_D9O0Gsxfk0RMDrzuVsNMKp5EEhS54z2emzDF0uxEH",
  },
];

const MonthlyPicks: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 
        style={{ fontFamily: "Manrope, sans-serif" }}
        className="text-2xl font-semibold">Monthly Picks</h2>
        <Button className="text-sm text-[#C1C1FF] bg-inherit flex">
          View Archive <ArrowRight/>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <div
            key={index}
            className="bg-[#111827] rounded-xl overflow-hidden border border-white/10 hover:scale-[1.02] transition"
          >
            <img src={book.img} alt={book.title} className="w-full h-60 object-cover" />

            <div className="p-4">
              <h3 className="font-medium">{book.title}</h3>
              <p className="text-gray-400 text-sm">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyPicks;