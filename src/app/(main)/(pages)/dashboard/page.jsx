"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Cover } from "@/components/ui/cover";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import Image from "next/image";
import { jsPDF } from "jspdf";  // For PDF generation
import * as XLSX from "xlsx";   // For Excel generation
import htmlToImage from "html-to-image"; // For image generation

const DashboardPage = () => {
  const [url, setUrl] = useState("");
  const [parseDescription, setParseDescription] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [scrapedContent, setScrapedContent] = useState([]);
  const [parsedContent, setParsedContent] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [convertedImages, setConvertedImages] = useState([]);

  const words = [
    { text: "Scrape" },
    { text: " ", className: "mr-2 " },
    { text: "Data" },
    { text: " ", className: "mr-2" },
    { text: "using" },
    { text: " ", className: "mr-2" },
    { text: "with" },
    { text: " ", className: "mr-2" },
    { text: "NxtScrape Ai.", className: "text-blue-500 dark:text-blue-500" },
  ];

  const links = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/",
    },
    {
      title: "share",
      icon: <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
    {
      title: "Components",
      icon: <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
    {
      title: "Changelog",
      icon: <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
    {
      title: "Twitter",
      icon: <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
  ];

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!isValidUrl(url)) {
      alert("Please enter a valid URL.");
      return;
    }

    if (!parseDescription) {
      alert("Please enter what you want to parse.");
      return;
    }

    try {
      setIsScraping(true);
      setLoadingMessage("Scraping content...");
      const scrapeResponse = await axios.post("http://127.0.0.1:8000/scrape", { url });

      if (scrapeResponse.data.scraped_content) {
        setScrapedContent((prev) => [...prev, scrapeResponse.data.scraped_content]);
        setLoadingMessage("Parsing content...");
      } else {
        setScrapedContent("No scraped content found.");
      }

      const parseResponse = await axios.post("http://127.0.0.1:8000/parse", {
        url,
        parse_description: parseDescription,
      });

      if (parseResponse.data.parsed_content) {
        setParsedContent(parseResponse.data.parsed_content);
      } else {
        setParsedContent("No parsed content found.");
      }

      setLoadingMessage("");
    } catch (error) {
      console.error("Error scraping and parsing the website", error);
      setLoadingMessage("An error occurred. Please try again.");
    } finally {
      setIsScraping(false);
    }
  };

  const handleInputChange = (ev) => {
    setUrl(ev.target.value);
  };

  const handleDescriptionChange = (ev) => {
    setParseDescription(ev.target.value);
  };

  const clearInput = () => {
    setUrl("");
    setParseDescription("");
  };

  const isValidUrl = (string) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+" +
        "[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!urlPattern.test(string);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Convert parsed content to PDF
  const convertToPDF = () => {
    const doc = new jsPDF();
    doc.text(parsedContent, 10, 10);
    doc.save("parsed-content.pdf");
  };

  // Convert parsed content to Excel
  const convertToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([parsedContent]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Parsed Content");
    XLSX.writeFile(workbook, "parsed-content.xlsx");
  };

  // Convert parsed content to Image
  const convertToImage = async () => {
    const node = document.getElementById("parsed-content-section");
    if (node) {
      try {
        const dataUrl = await htmlToImage.toPng(node);
        setConvertedImages([...convertedImages, dataUrl]);
      } catch (error) {
        console.error("Failed to convert content to image", error);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 relative">
        <h1 className="text-4xl p-4">
          <Cover>NXTSCRAPE AI</Cover>
        </h1>
        <BackgroundBeams />
        <div className="flex h-2 w-full ml-96 p-2">
          <FloatingDock
            mobileClassName="translate-y-20"
            items={links}
          />
        </div>
        <TypewriterEffectSmooth words={words} className="text-center " />
      </div>

      <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <div className="relative z-10 flex flex-col items-center mt-8">
          <form onSubmit={handleSubmit} className="grid gap-2">
            <input
              className="border-2 rounded-full w-80 bg-transparent text-white px-4 py-2 grow"
              value={url}
              onChange={handleInputChange}
              type="url"
              placeholder="Enter a valid URL"
              required
            />
            <input
              className="border-2 rounded-full bg-transparent text-white px-4 py-2 grow mt-2"
              value={parseDescription}
              onChange={handleDescriptionChange}
              type="text"
              placeholder="Enter what to parse (e.g. Extract product names)"
              required
            />
            <button
              className="bg-emerald-500 text-white px-4 py-2 rounded-full uppercase z-10 mt-2"
              type="submit"
              disabled={isScraping}
            >
              {isScraping ? "Processing..." : "Parse"}
            </button>
            <button
              type="button"
              onClick={clearInput}
              className="bg-red-500 text-white px-4 py-2 rounded-full uppercase z-10 mt-2"
              disabled={isScraping}
            >
              Clear
            </button>
          </form>
        </div>

        {loadingMessage && <p className="text-white mt-4">{loadingMessage}</p>}

        {parsedContent && (
          <div className="w-full max-w-2xl mt-4 text-white" id="parsed-content-section">
            <p>{parsedContent}</p>

            <div className="mt-4 space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={convertToPDF}>
                Download PDF
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={convertToExcel}>
                Download Excel
              </button>
              <button className="bg-purple-500 text-white px-4 py-2 rounded" onClick={convertToImage}>
                Download Image
              </button>
            </div>

            {convertedImages.length > 0 && (
              <div className="mt-4">
                <h2 className="text-lg">Converted Images:</h2>
                {convertedImages.map((imgUrl, index) => (
                  <div key={index} className="mt-2">
                    <Image src={imgUrl} alt={`Converted Image ${index + 1}`} width={400} height={300} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
