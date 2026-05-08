export type CollectionItem = {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt?: string;
  titleClassName?: string;
};

export type TrendingItem = {
  title: string;
  author: string;
  duration: string;
  rating: string;
  badge?: string;
  coverImageSrc: string;
  coverImageAlt?: string;
  coverOverlayClassName?: string;
  accent?: string;
};

export type StaffPick = {
  title: string;
  badge: string;
  summary: string;
  editor: string;
  coverImageSrc: string;
  coverImageAlt?: string;
};

export const featuredStory = {
  eyebrow: "Featured Title",
  title: ["The Celestial", "Weaver"],
  description:
    "In a world where stars are spun from the dreams of mortals, a young apprentice discovers a thread that threatens to unravel the fabric of the universe itself.",
};

export const curatedCollections: CollectionItem[] = [
  {
    title: "The Dark Academia",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5MAaW2NcAdsphQfo2S__TxJsejdXXa9Q7RxStzLPq-SC7KX4BdkAai6zGZB0yKtWSz4W-5LPG1Y9JHihsA13iqvLtYzy6CnJkSe0xP-RwWn_FxgHnz7W1Wz43pNxKzaH5XzglDDnU5OQNvnI7c0wmR4HvPGOukgZm0Ae_Q9VHb9gFZ6PSBmKWYHO6CfIpk9rphF49_JVCq7SXihiNL7p8wBtAWTmH7lbxC2LRgIgYvEDi9vOFUY_-V1a2gNHyq0xX0F5WlDytQvrd",
    imageAlt: "Stacked old books",
    titleClassName: "max-w-[7.2ch]",
  },
  {
    title: "Neon Horizons",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuADyb76IDhaKeW9oAWL3v_5zcSGV8PAHsZX9ZYcm-4xQQ1oqMTowMyNIPGUeKBh6OPenEc8sDwHn_cEYrpH5531a62nL2oJH2Bs7McxCKwThzGZpajyAZx8BBtxNBt_5Hhc8zsZ50IrRbKwK0sTxIqywigC_jeMazFiG1Lu7brc_kBklkuyC0CM0rzzXb28qzRTQ_92OAK3BB-C74v6CK9oCC10gr33IBNjYVmgDBzsWK3hctcRXxhu5RLZxlp3BhWuYgzW53ULJGZm",
    imageAlt: "A moody cyberpunk alley at night",
    titleClassName: "max-w-[8.6ch]",
  },
  {
    title: "Untamed Wilderness",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBcXXM-qjxLpbqK6KQuto074bcSaLpfuP_MA3gZBr0KaCqE8JGWhKsigQrQZFLBazQGjYxu7Dfzsy7aV_BJTKBoRmxI7xZwepYcp0ykQzX3T0jFl5oGf5rlVVni8fxRQrUgjwXNgbYVCDenE0mWm-DE_WmxUQlMqHdJ0YUgIhJuIz4F9bFAv5xaB-4TkzkZz0Cz9Id1e6J6BtGymjTBku5d85k6l9ZmSdO1sPrFfugimh3XPNtdvSPsSno-nSPH4RSGAyZ_1RAR4oB",
    imageAlt: "A misty forest path surrounded by tall trees",
    titleClassName: "max-w-[7ch]",
  },
];

export const trendingStories: TrendingItem[] = [
  {
    title: "Moonlit Oath",
    author: "Elara Finch",
    duration: "9 min left",
    rating: "4.9",
    badge: "Hot",
    coverImageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAj1BiVVKLOqmiYm-pE-AnTngVpc37cfUlQbYN0tmgl0udoqCxO2purIhOVwpsv2_eNH3nE7Y7FKov61G-oxu19ePx3iTKDHfHW7ZIcg1GckzglEHBL6zIEDLrV1MY6J7omECOLurQWWjnAUQ72semXBjlYxW418blLjqWle9Ne1IzIpoZHGKA9TxIAL_ZDgldgcjfPhY3LtZdPtadbFQ4Wx02liqU0ik_0hegso6kHEHH4vUKeiKR12Za_lGHiP3MD1ErvMFDzCwVD",
    coverImageAlt: "Moonlit Oath cover art",
    coverOverlayClassName:
      "bg-[linear-gradient(180deg,rgba(5,8,14,0.08)_0%,rgba(5,8,14,0.24)_42%,rgba(5,8,14,0.56)_100%)]",
    accent: "text-amber-200",
  },
  {
    title: "Ashes of Winter",
    author: "Noah Glass",
    duration: "16 min left",
    rating: "4.7",
    coverImageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc7O16BjULfjEhLSs7j-dFsHlbz70Vl64S42NN54YnJJqvgvbnBCDDP07gBC-eEjwz0bD5tzCSTHGr839dAk5HVfZol_v8Fjl0wa75FX4LFz71WFKCqqrMorgCnvVYMfV8agj9m8OMGllF5hqkLpdFl3odTBUOUf35tP9r4mMPxGTC7YbtYSn-CjYFS8RXS9ABNVVrRGbLw6i6p2T4M4-djEqbll-UoBeNmwHatwj9x898Qm-T6sXuj8MTVP0y8AOPAOVFNqsuWRKL",
    coverImageAlt: "Ashes of Winter cover art",
    coverOverlayClassName:
      "bg-[linear-gradient(180deg,rgba(4,12,18,0.08)_0%,rgba(4,12,18,0.22)_40%,rgba(4,12,18,0.54)_100%)]",
  },
  {
    title: "The River Archive",
    author: "Ira Bloom",
    duration: "11 min left",
    rating: "4.8",
    coverImageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIL1LHVnFRHzlmX6KkFydyDvnZE8lVX8NgNrJdaJ2OeQa-2QRBFKgzSBI10UYxZwZBpv3Wax1RZdPhR8H9WAJCQa3xgPMggXVyzd30x8qV8GGFbw_WUiI69mRBOEhn08QSJRXf2fHIxXAcl4n0PCQUP5Car1Q-IQgMbAI6V5AwmXfUpF0U9jX45awEhy2Gj2xcARn01LJ0HUsbBVNPNr91j1AlYk_4vZr6NCHsS97G4ukmUy8wOYbOx3s_bVC30dhspP6KN2vPKzc6",
    coverImageAlt: "The River Archive cover art",
    coverOverlayClassName:
      "bg-[linear-gradient(180deg,rgba(5,10,13,0.08)_0%,rgba(5,10,13,0.22)_40%,rgba(5,10,13,0.52)_100%)]",
  },
  {
    title: "Glass Orchard",
    author: "Reed Nolan",
    duration: "7 min left",
    rating: "5.0",
    coverImageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBK2OgUGgBuRrefHjnJ8ww9UWMRtm2qcv7Hbjag8bvjRTTZMA8JSgdXvz1MAkwHf_VEejlowoVw0uuErxJBacy9dLP0KZ4vRfduDJ8-8EyV8Mlb3c1VPyHFG-4zJ6pe4lBL_Quo7xsLnzGda_s2ybpS8P09vV4qnR1FgCA71uNoThaSaduaZqb4mRVfkWoJGLZquqiSLgXThp3YyGFrWzljInsjKKuFEB395kdERoOOJxRVE9e0wbLG7T_2FRaM1WMFzffqeyvJi-e3",
    coverImageAlt: "Glass Orchard cover art",
    coverOverlayClassName:
      "bg-[linear-gradient(180deg,rgba(18,8,4,0.06)_0%,rgba(18,8,4,0.2)_38%,rgba(18,8,4,0.5)_100%)]",
  },
];

export const staffPicks: StaffPick[] = [
  {
    title: "Letters from Halcyon",
    badge: "Editor's Choice",
    summary:
      '"An emotional powerhouse that redefines epistolary fiction. I couldn’t put it down."',
    editor: "Julian V., Senior Editor",
    coverImageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAj1BiVVKLOqmiYm-pE-AnTngVpc37cfUlQbYN0tmgl0udoqCxO2purIhOVwpsv2_eNH3nE7Y7FKov61G-oxu19ePx3iTKDHfHW7ZIcg1GckzglEHBL6zIEDLrV1MY6J7omECOLurQWWjnAUQ72semXBjlYxW418blLjqWle9Ne1IzIpoZHGKA9TxIAL_ZDgldgcjfPhY3LtZdPtadbFQ4Wx02liqU0ik_0hegso6kHEHH4vUKeiKR12Za_lGHiP3MD1ErvMFDzCwVD",
    coverImageAlt: "Letters from Halcyon cover art",
  },
  {
    title: "Wanderers of Dawn",
    badge: "Rising Star",
    summary:
      '"Mina Kade’s prose is like velvet. This sci-fi epic feels both ancient and refreshingly new."',
    editor: "Sarah L., Content Lead",
    coverImageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc7O16BjULfjEhLSs7j-dFsHlbz70Vl64S42NN54YnJJqvgvbnBCDDP07gBC-eEjwz0bD5tzCSTHGr839dAk5HVfZol_v8Fjl0wa75FX4LFz71WFKCqqrMorgCnvVYMfV8agj9m8OMGllF5hqkLpdFl3odTBUOUf35tP9r4mMPxGTC7YbtYSn-CjYFS8RXS9ABNVVrRGbLw6i6p2T4M4-djEqbll-UoBeNmwHatwj9x898Qm-T6sXuj8MTVP0y8AOPAOVFNqsuWRKL",
    coverImageAlt: "Wanderers of Dawn cover art",
  },
];
