/* eslint-disable @next/next/no-img-element */
import { SyntheticEvent, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { IArticle } from '../../interfaces/article';

const PageIndex = () => {
  const [article, setArticle] = useState<IArticle | null>(null);
  const [published, setPublished] = useState('');
  useEffect(() => {
    const text = window?.localStorage?.getItem('article');
    if (!text) {
      window.location.href = '/';
      return;
    }
    const selected: IArticle = JSON.parse(text);
    setArticle(selected);

    const publishedAt = new Date(selected.publishedAt);
    const pub = publishedAt.getTime();
    const cur = new Date().getTime();
    if (cur - pub < 1000 * 60 * 60) {
      setPublished(`${Math.floor((cur - pub) / (60 * 1000))}분 전`);
      return;
    }
    if (cur - pub < 1000 * 60 * 60 * 24) {
      setPublished(`${Math.floor((cur - pub) / (24 * 1000 * 60))}시간 전`);
      return;
    }
    const pubDate = publishedAt
      .toLocaleDateString()
      .split(' ')
      .map((e) => e.replace('.', ''))
      .join('-');
    const pubTime = publishedAt.toLocaleTimeString();
    setPublished(pubDate + ' ' + pubTime);
  }, []);

  const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.currentTarget.src = '/on_error.png';
  };

  return (
    <Layout>
      <div className="w-full gap-6 pt-2 pb-6 px-4">
        {article ? (
          <>
            <h1 className="text-xl font-bold">{article.title}</h1>
            <img
              src={article.urlToImage ? article.urlToImage : '/on_error.png'}
              alt={article.title}
              onError={handleImageError}
              className="mt-4 md:w-1/2"
            />
            <p className="mt-4 font-light text-black">
              <span className="font-bold mr-2">{published}</span>
              {article.description ? article.description : '기사 원문 참조'}
            </p>
            {article.author ? (
              <h4 className="mt-2 inline-flex px-2 py-1 text-md rounded-md text-white bg-red-500">
                {article.author}
              </h4>
            ) : (
              <></>
            )}
            <br />
            <a
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex px-4 py-1 text-lg text-white rounded-md"
              style={{ backgroundColor: '#Bfb384' }}
            >
              바로가기
            </a>
          </>
        ) : (
          <h1 className="text-xl font-bold">Loading...</h1>
        )}
      </div>
    </Layout>
  );
};

export default PageIndex;
