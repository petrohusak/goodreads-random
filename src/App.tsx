import { useCallback, useState } from 'react';
import './App.css';

import XMLParser from 'react-xml-parser';

export type BookItem = {
  title: string;
  author: string;
  image: string;
  link: string;
  id: string;
};

function App() {
  const [folders] = useState([
    {
      link: 'https://www.goodreads.com/review/list_rss/174363604?key=2-Xd89Qe_nRWbjGhhHG8yyLJCxtT9tFIStsDias0QmcWrE_s&shelf=to-read',
      name: 'To read',
    },
    {
      link: 'https://www.goodreads.com/review/list_rss/174363604?key=2-Xd89Qe_nRWbjGhhHG8yyLJCxtT9tFIStsDias0QmcWrE_s&shelf=bought',
      name: 'Bought',
    },
    {
      link: 'https://www.goodreads.com/review/list_rss/174363604?key=2-Xd89Qe_nRWbjGhhHG8yyLJCxtT9tFIStsDias0QmcWrE_s&shelf=next-in-cycle',
      name: 'Next in cycle',
    },
  ]);
  const [count, setCount] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [allPages, setAllPages] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [randomResult, setRandomResult] = useState<BookItem[]>([]);

  const getPropertyValue = useCallback(
    (allChildren: any, propertyName: string) =>
      allChildren?.find((i: any) => i?.name === propertyName)?.value || '',
    [],
  );

  const loadBooksForShelf = async () => {
    let shouldLoadMore = true;
    let page = 1;

    let allPagesLocal: BookItem[] = [];

    // load untill load all pages
    while (shouldLoadMore) {
      const worker_url =
        'https://goodreads-random-proxy.petro-husak-1998.workers.dev/';
      const requiredUrl = `${selectedFolder}&page=${page}`;
      const url = `${worker_url}/?url=${encodeURIComponent(requiredUrl)}`;

      const data = await fetch(url).then((res) => res.text());
      const xmlDoc = new XMLParser().parseFromString(data);

      const items = xmlDoc.getElementsByTagName('item');

      const resultItems = items.map((book: any) => {
        const data = book?.children;
        return {
          title: getPropertyValue(data, 'title'),
          author: getPropertyValue(data, 'author_name'),
          image:
            getPropertyValue(data, 'book_large_image_url') ||
            getPropertyValue(data, 'book_image_url'),
          link: getPropertyValue(data, 'link'),
          id: getPropertyValue(data, 'guid'),
        };
      }) as BookItem[];

      allPagesLocal = [...allPagesLocal, ...resultItems];
      if (resultItems.length < 100) {
        shouldLoadMore = false;
      } else {
        page += 1;
      }
    }

    return allPagesLocal;
  };

  const getItems = async () => {
    setIsLoading(true);

    const pages = !!allPages?.length ? allPages : await loadBooksForShelf();

    if (!allPages?.length) setAllPages(pages);

    let randomIndexes: number[] = [];

    for (let i = 0; i < +count; i++) {
      const index = Math.floor(Math.random() * pages.length);
      randomIndexes.push(index);
    }

    setRandomResult(
      pages.filter((_: any, index: number) =>
        randomIndexes.some((sItem) => sItem === index),
      ),
    );
    setIsLoading(false);
  };

  return (
    <div className="bg">
      <div className="topBlock">
        <div>
          <label htmlFor="folder-select">Choose folder:</label>
          <select
            name="folders"
            id="folder-select"
            value={selectedFolder}
            onChange={(e) => {
              setAllPages([]);
              setSelectedFolder(e.target.value);
            }}
          >
            <option value="">--Please choose a folder--</option>
            {folders.map((item) => (
              <option value={item.link} key={item.link}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="inputContainer">
          <label htmlFor="count-input">Enter amount of items to pick:</label>
          <input
            id="count-input"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            type={'number'}
          />
        </div>
      </div>
      <div className="buttonContainer">
        <button
          onClick={getItems}
          type={'submit'}
          disabled={!count?.length || !selectedFolder || isLoading}
        >
          Get books
        </button>
      </div>
      <div className="resultsBlock">
        {randomResult?.map((item) => (
          <div key={item.id} className="resultItem">
            <img src={item?.image?.replace(' >', '')} className="resultImage" />
            <div>{item.title}</div>
            <div>{item?.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
