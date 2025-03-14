import React from "react";
import { userItf } from "../../../../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../stores/rootState";

type ChatImageProps = {
    members: userItf[];
};

const ChatImage = ({ members }: ChatImageProps) => {
    const user = useSelector((state: RootState) => state.auth.user);

    const membersExludingUser = members.filter(
        (member) => member.id !== user?.id
    );

    return (
        <>
            {membersExludingUser.length === 1 && (
                <img
                    key={membersExludingUser[0].id}
                    src={membersExludingUser[0].photo}
                    alt=""
                    className={`w-10 h-10 shrink-0 rounded-full object-cover bg-white shadow-md`}
                />
            )}
            {membersExludingUser.length >= 2 && (
                <div className="grid grid-cols-2 grid-rows-2 gap-1 w-10 h-10 shrink-0">
                    {members.slice(0, 3).map((member, index) => {
                        return (
                            <img
                                key={member.id}
                                src={member.photo}
                                alt=""
                                className={`w-full h-full rounded-full object-cover bg-white shadow-md`}
                            />
                        );
                    })}
                    {members.length > 3 && (
                        <div
                            className={`w-full h-full rounded-full shadow-md flex bg-white items-center justify-center text-gray-600 opacity-80 font-bold text-xs`}
                        >
                            +{members.length - 3}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ChatImage;
