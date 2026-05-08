export default function ActivityPanel() {
  const data = [
    {
      title: "Echoes of Silence",
      author: "Elena Miras",
      progress: 32,
      cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWIDZFxQs8bnRTsmS4SU1YqXJbbZhvFAz8yvOQdeG9uXe9jHTzNYunfV-XFvb26jWww4A71iSHDmP4dbKsG9MIZD6o_xXrvl7X_ilskHLngTTBdnofyct7iTxFatcLLEbML7M-shwmMfqkXJogwlNXsdkTFpP4uyUgs-wg2Od_1TxQ3rfMHMPXG_Z5W74uGFm6M5vA1IFjGGD4Cxdb4h_OEaqLZTVlsZkgDqigVwHoa8j4jJNbS13rohPvGIJ--yQAZ3xvHoP7vPHY",
    },
    {
      title: "Beyond the Grid",
      author: "Marcus Thorne",
      progress: 58,
      cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxDfmv2J-xdoch8_KQM43h1QuR3CimhsbwrrTFkD8DxuuqXt7yAO6vnEd5tgBx3Ydd7CcucitMP4vwIH6Liw3kq0Yl7MQec-ALEKGVRxxIYAf4qiWNKEKdEPsRFlBfDTqVneuzMjvmiHUO2b3ThnR2rjR-NyJAa2FcU33UFdiCQsfi9w0EguyHuRa_HkGObwKm8RkjbN_IjfPj38KhJVJPx52JhkqMVlMxVgXLE4mq4hju10KJWxpBzpiZE2nAhe3DC7DDwdoTO0vO",
    },
  ];

  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      {data.map((item, i) => (
        <div
          key={i}
          className="rounded-md p-5 bg-[#1D2023]"
        >
          {/* Top Section */}
          <div className="flex gap-4">
            {/* Cover */}
            <div className="w-14 h-20 rounded-md overflow-hidden bg-[#0C0E12]">
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400">
                {item.author}
              </p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[3px] bg-[#2F343B] rounded-full">
                <div
                  className="h-full bg-[#BFAAFF] rounded-full"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">
                {item.progress}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}