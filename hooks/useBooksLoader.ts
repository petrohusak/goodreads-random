import { BookItem } from '@/app/random';
import { useAppSelector } from '@/context/store';
import { XMLParser } from 'fast-xml-parser';

const useBooksLoader = () => {
  const { rssData } = useAppSelector((state) => state.main);

  const loadBooksForShelf = async (shelfName: string) => {
    let shouldLoadMore = true;
    let page = 1;

    let allPages: BookItem[] = [];

    // load untill load all pages
    while (shouldLoadMore) {
      const data = await fetch(`${rssData[shelfName]}&page=${page}`).then(
        (res) => res.text(),
      );

      const parser = new XMLParser({
        ignoreAttributes: false, // щоб отримати посилання на зображення
        attributeNamePrefix: '',
      });
      const jsonObj = parser.parse(data);

      const items = jsonObj.rss.channel.item.map((book: any) => ({
        title: book.title,
        author: book.author_name,
        image: book.book_large_image_url || book.book_image_url,
        link: book.link,
        id: book.guid,
      })) as BookItem[];
      allPages = [...allPages, ...items];
      if (items.length < 100) {
        shouldLoadMore = false;
      } else {
        page += 1;
      }
    }

    return allPages;
  };

  return { loadBooksForShelf };
};

export default useBooksLoader;
