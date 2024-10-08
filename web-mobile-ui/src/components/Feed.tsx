import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Video from "./Video";
import Image from "./Image";
interface MediaType {
  video?: string;
  image?: string;
  short?: string;
}

export default function Feed({ refresh }: { refresh: number }) {
  const [dataStream, setDataStream] = useState<MediaType[]>([]); // Entire data stream payload
  const [preferredStream, setPreferred] = useState<MediaType[]>([]);
  const [renderBlock, setRenderBlock] = useState<MediaType[]>([]); // data is render in block of 3
  const [cookies] = useCookies(["preferences"]);

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  };

  function filterMediaPreferences() {
    const preferences = cookies.preferences["display-options"];
    const newStream: MediaType[] = dataStream.filter((media) =>
      preferences.some((mediaType: string) => mediaType in media)
    );

    setPreferred(newStream);
  }

  var renderNextBlock = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const newBlockSize = renderBlock.length + 3;
        setRenderBlock(preferredStream.slice(0, newBlockSize));
      }
    });
  };

  var observer = new IntersectionObserver(renderNextBlock, options);

  const fetchData = async () => {
    try {
      const requestOptions = {
        method: "GET",
        mode: "cors" as RequestMode,
      };

      const res = await fetch(
        `http://${import.meta.env.VITE_BACK_END_LOCAL_IPv4}:${
          import.meta.env.VITE_BACK_END_PORT
        }/stream`,
        requestOptions
      );
      const dataStream: MediaType[] = await res.json();
      setDataStream(dataStream);
    } catch (err) {
      console.log(err);
    }
  };

  function initializeRenderBlock() {
    preferredStream.length > 3
      ? setRenderBlock(preferredStream.slice(0, 3))
      : setRenderBlock(preferredStream);
  }

  function observeNextRenderBlock() {
    if (renderBlock.length >= 3) {
      const blockSize = renderBlock.length;
      const observeID = blockSize - 3;
      const observedElement: HTMLElement | null = document.getElementById(
        `${observeID}`
      );
      observedElement && observer.observe(observedElement);
    }
  }

  useEffect(() => {
    refresh != 0 && setDataStream([]);
    fetchData();
  }, [refresh]);

  useEffect(() => {
    filterMediaPreferences();
  }, [dataStream]);

  useEffect(() => {
    initializeRenderBlock();
  }, [preferredStream]);

  useEffect(() => {
    fetchData();
    setRenderBlock([]);
    filterMediaPreferences();
  }, [cookies.preferences]);

  useEffect(() => {
    observeNextRenderBlock();
  }, [renderBlock]);

  return (
    <>
      {renderBlock.map(
        (stream: { photo?: string; video?: string; short?: string }, index) => {
          if ("photo" in stream)
            return <Image key={index} id={index} src={stream.photo} />;

          if ("video" in stream)
            return (
              <Video
                key={index}
                id={index}
                src={`${import.meta.env.VITE_VIDEO_DATA_DIR}${stream.video}`}
              />
            );

          if ("short" in stream)
            return (
              <Video
                key={index}
                id={index}
                src={`${import.meta.env.VITE_SHORT_DATA_DIR}${stream.short}`}
              />
            );
        }
      )}
    </>
  );
}
