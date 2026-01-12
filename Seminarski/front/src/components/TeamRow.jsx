import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import Button from "./Button";

const TeamRow = ({ index, tim, isAdmin, onUpdate, onNameClick }) => {
  const { logo, naziv_tima: name, score, tim_id } = tim;
  const [currentScore, setCurrentScore] = useState(score);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentScore(score);
  }, [score]);

  const getRankStyle = (idx) => {
    if (idx === 0)
      return "bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-200";
    if (idx === 1) return "bg-slate-300 text-slate-700";
    if (idx === 2) return "bg-amber-600 text-white";
    return "bg-gray-100 text-gray-400";
  };

  const saveScore = async () => {
    setLoading(true);
    const uspeh = await onUpdate(Number(tim_id), currentScore);
    if (uspeh) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  return (
    <tr className="group border-b border-gray-50 last:border-0 hover:bg-indigo-50/50 transition-all">
      <td className="p-6">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${getRankStyle(
            index
          )}`}
        >
          {index + 1}
        </div>
      </td>

      <td className="p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={logo}
              alt={name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform"
            />
          </div>
          <div>
            <p
              onClick={onNameClick}
              className="cursor-pointer text-xl font-black uppercase italic tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors"
            >
              {name}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Pub Kviz Takmičar
            </p>
          </div>
        </div>
      </td>

      <td className="p-6 text-right">
        <div className="flex items-center justify-end gap-4">
          {isAdmin && isEditing ? (
            <div className="w-32">
              <FormInput
                type="number"
                value={currentScore}
                onChange={(e) => setCurrentScore(e.target.value)}
                placeholder="Bodovi"
              />
            </div>
          ) : (
            <div className="inline-flex flex-col items-end">
              <span className="text-4xl font-black text-gray-900 tabular-nums leading-none">
                {score}
              </span>
              <span className="text-[9px] font-black uppercase text-indigo-500 mt-1 tracking-tighter">
                Points
              </span>
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center gap-2 ml-4">
              {!isEditing ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="!p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={saveScore}
                    isLoading={loading}
                    className="!bg-green-500 hover:!bg-green-600 !p-2"
                  >
                    {!loading && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentScore(score);
                    }}
                    className="!p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TeamRow;
