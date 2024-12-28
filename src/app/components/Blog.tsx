"use client";
import React, { useRef, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaCopy,
  FaShareAlt,
} from "react-icons/fa";
import { Daum } from "@/api/blog/blog.interface";

interface BlogPostComponentProps {
  blog: Daum;
}

const BlogPostComponent = ({ blog }: BlogPostComponentProps) => {
  if (!blog) {
    notFound(); // Trigger 404 page
  }

  const [showAlert, setShowAlert] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // const downloadPDF = async () => {
  //   if (contentRef.current) {
  //     const content = contentRef.current;
  //     const doc = new jsPDF({
  //       orientation: 'portrait',
  //       unit: 'px',
  //       format: [window.innerWidth, window.innerHeight]
  //     });
  
  //     // Capture the content using html2canvas with a lower resolution for better performance
  //     const canvas = await html2canvas(content, {
  //       scale: 1.5, // Lower scale to reduce image resolution
  //       logging: false, // Disable logging
  //       useCORS: true // Handle CORS for external images
  //     });
  
  //     let imgData = canvas.toDataURL("image/jpeg", 0.75); // Convert to JPEG with 75% quality
  
  //     const contentWidth = canvas.width;
  //     const contentHeight = canvas.height;
  
  //     const pdfWidth = doc.internal.pageSize.getWidth();
  //     const pdfHeight = doc.internal.pageSize.getHeight();
  
  //     const scaleFactor = pdfWidth / contentWidth; // Scale factor based on width
  //     const imgScaledWidth = pdfWidth; // Full width
  //     const imgScaledHeight = contentHeight * scaleFactor; // Maintain aspect ratio for height
  
  //     // Add the first image to the first page
  //     doc.addImage(imgData, "JPEG", 0, 0, imgScaledWidth, imgScaledHeight);
  
  //     let offsetY = imgScaledHeight;
  
  //     // Handle overflow to multiple pages, ensuring correct order
  //     while (offsetY > pdfHeight) {
  //       doc.addPage(); // Add new page
  //       // Add the remaining content (offsetY is subtracted to show next part)
  //       doc.addImage(imgData, "JPEG", 0, -offsetY + pdfHeight, imgScaledWidth, imgScaledHeight);
  //       offsetY -= pdfHeight; // Subtract the page height for the remaining content
  //     }
  
  //     // Save the PDF
  //     doc.save("download.pdf");
  //   }
  // };
  
  const downloadPDF = async () => {
    if (contentRef.current) {
        const content = contentRef.current;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [window.innerWidth, window.innerHeight],
        });

        // Capture the content using html2canvas with a resolution that's balanced for performance
        const canvas = await html2canvas(content, {
            scale: 1.5,  // Adjust resolution to balance performance and image quality
            logging: false,  // Disable logs for a cleaner process
            useCORS: true,  // Handle external resources (images) with CORS enabled
        });

        let imgData = canvas.toDataURL("image/jpeg", 0.75); // Compress image to 75% quality for smaller file size

        const contentWidth = canvas.width;
        const contentHeight = canvas.height;

        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();

        const scaleFactor = pdfWidth / contentWidth;  // Determine the scale factor to fit the content width
        const imgScaledWidth = pdfWidth;  // Set the image width to match the PDF width
        const imgScaledHeight = contentHeight * scaleFactor;  // Adjust height based on scale factor

        let offsetY = 0;

        // Add first page with content
        doc.addImage(imgData, "JPEG", 0, 0, imgScaledWidth, imgScaledHeight);
        offsetY = imgScaledHeight; // Set the offset to the height of the first page

        // Handle content overflow and add new pages as needed
        while (offsetY < contentHeight) {
            doc.addPage(); // Add a new page for the next portion of content
            const yPosition = -offsetY + pdfHeight;  // Position the content correctly on the new page
            doc.addImage(imgData, "JPEG", 0, yPosition, imgScaledWidth, imgScaledHeight);
            offsetY += pdfHeight; // Move the offset down by the height of a page
        }

        // Save the PDF with the filename "download.pdf"
        doc.save("download.pdf");
    }
};



  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Blog Post */}
      <div ref={contentRef}  className="bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900 min-h-screen">
        <div  className="container mx-auto px-4 py-12">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Blog Thumbnail */}
            <div className="relative h-80 sm:h-[400px]">
              <img
                src={`${blog?.thumbnail?.url}`}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              <h1
                className="absolute bottom-4 left-4 right-4 text-white font-bold text-2xl md:text-4xl lg:text-5xl leading-tight px-4 shadow-2xl"
                style={{
                  textShadow: "2px 4px 6px rgba(0, 0, 0, 0.8)", // Custom elevated shadow
                }}
              >
                {blog.title}
              </h1>
            </div>

            {/* Blog Content */}
            <div className="p-6">
              {/* Category */}
              <div className="mb-4">
                <span className="inline-block bg-indigo-100 text-indigo-600 py-1 px-3 rounded-full text-sm font-medium">
                  {blog.category?.name || "Uncategorized"}
                </span>
              </div>

              {/* Blog Body */}
              <div
                className="blog-content text-lg text-gray-700 leading-relaxed space-y-6 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-6"></div>

            {/* Share Section */}
            <div className="px-6 pb-6 space-y-4">
              {/* Share Button */}
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all"
                title="Share this post"
              >
                <FaShareAlt className="text-xl" />
                <span>Share this Post</span>
              </button>

              {/* Social Media Share Options */}
              {showShareOptions && (
                <div className="space-y-4 mt-4">
                  {/* WhatsApp Share Button */}
                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(
                          `Check out this blog: ${blog.title} - ${window.location.href}`
                        )}`,
                        "_blank"
                      )
                    }
                    className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg flex items-center justify-center gap-3 hover:bg-green-700 transition-all"
                    title="Share on WhatsApp"
                  >
                    <FaWhatsapp className="text-xl" />
                    <span>Share on WhatsApp</span>
                  </button>

                  {/* Twitter Share Button */}
                  <button
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          window.location.href
                        )}&text=${encodeURIComponent(blog.title)}`,
                        "_blank"
                      )
                    }
                    className="w-full p-3 bg-blue-400 text-white font-semibold rounded-lg flex items-center justify-center gap-3 hover:bg-blue-500 transition-all"
                    title="Share on Twitter"
                  >
                    <FaTwitter className="text-xl" />
                    <span>Share on Twitter</span>
                  </button>

                  {/* Facebook Share Button */}
                  <button
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          window.location.href
                        )}`,
                        "_blank"
                      )
                    }
                    className="w-full p-3 bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-3 hover:bg-blue-800 transition-all"
                    title="Share on Facebook"
                  >
                    <FaFacebook className="text-xl" />
                    <span>Share on Facebook</span>
                  </button>

                  {/* Copy Link Button */}
                  <button
                    onClick={handleCopyLink}
                    className="w-full p-3 bg-gray-600 text-white font-semibold rounded-lg flex items-center justify-center gap-3 hover:bg-gray-700 transition-all"
                    title="Copy Link"
                  >
                    <FaCopy className="text-xl" />
                    <span>Copy Link</span>
                  </button>
                </div>
              )}

              {/* Back Buttons */}
              <div className="mt-8 space-y-4">
                <div className="flex flex-col space-y-4 w-full">
                  <Link href="/">
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg">
                      ⬅ Back to Posts
                    </button>
                  </Link>
                  <button
                    onClick={scrollToTop}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-teal-600 hover:to-green-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
                  >
                    ⬆️ Back to Top
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={downloadPDF}>Download as PDF</button>
      {/* Copy Link Alert */}
      {showAlert && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between">
          <span>Link copied to clipboard!</span>
          <button
            onClick={() => setShowAlert(false)}
            className="text-white font-bold ml-2"
          >
            &#10005;
          </button>
        </div>
      )}
    </>
  );
};

export default BlogPostComponent;
