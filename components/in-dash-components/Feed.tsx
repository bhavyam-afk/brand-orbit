"use client";
import React from 'react'

const Feed = ({ initialFeed }: { initialFeed: any[] }) => {
    const feed = initialFeed;
    console.log("Rendering feed with brands:", feed)
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Explore Brands Here</h2>
            {feed && feed.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {feed.map((brand: any) => (
                        <div
                            key={brand.id}
                            className="bg-white rounded-xl shadow p-4"
                        >
                            <img
                                src={brand.logoUrl || "/brand-placeholder.png"}
                                className="w-16 h-16 rounded-full mb-3"
                            />
                            <div className="font-bold">@{brand.username}</div>
                            <p className="text-sm text-gray-600">{brand.bio}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {brand.industryTags.map((tag: string) => (
                                    <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No brands available in the feed.</p>
            )}
        </div>
    )
}

export default Feed
