import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "gadget-speaker",
    name: "ポケットスピーカー",
    description:
      "小さめのバッグにも入る、持ち運びしやすい Bluetooth スピーカーです。",
    price: 6800,
    category: "ガジェット",
    imageUrl:
      "https://picsum.photos/id/10/300/200",
    stock: 8,
    rating: 4.4,
  },
  {
    id: "gadget-keyboard",
    name: "ワイヤレスキーボード",
    description:
      "静かな打鍵感で、講義や作業会でも使いやすいキーボードです。",
    price: 9200,
    category: "ガジェット",
    imageUrl:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80",
    stock: 5,
    rating: 4.7,
  },
  {
    id: "fashion-tote",
    name: "キャンバストート",
    description:
      "A4 ノートやノート PC を入れやすい、毎日使いやすいトートバッグです。",
    price: 3200,
    category: "ファッション",
    imageUrl:
      "https://sc3.locondo.jp/contents/commodity_image/BA/BA4706AW02716_1_l.jpg",
    stock: 14,
    rating: 4.1,
  },
  {
    id: "fashion-shirt",
    name: "リラックスシャツ",
    description:
      "やわらかい着心地で、きれいめにもカジュアルにも合わせやすい一枚です。",
    price: 5400,
    category: "ファッション",
    imageUrl:
      "https://www.intermaxis.com/wp/wp-content/uploads/2025/05/novelty-kyutech.png",
    stock: 7,
    rating: 4.2,
  },
  {
    id: "book-nextjs",
    name: "はじめての Next.js ノート",
    description:
      "App Router と React Hooks をゆっくり学べる、入門者向けの解説本です。",
    price: 2600,
    category: "本",
    imageUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    stock: 20,
    rating: 4.8,
  },
  {
    id: "book-design",
    name: "やさしい UI デザイン読本",
    description:
      "色、余白、タイポグラフィの基本をサンプル付きで学べる一冊です。",
    price: 2800,
    category: "本",
    imageUrl:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
    stock: 11,
    rating: 4.5,
  },
  {
    id: "food-coffee",
    name: "ドリップコーヒーセット",
    description:
      "作業の合間に飲みやすい、香りのよいドリップバッグの詰め合わせです。",
    price: 1800,
    category: "食品",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    stock: 18,
    rating: 4.3,
  },
  {
    id: "food-cookie",
    name: "バタークッキー缶",
    description:
      "みんなで分けやすい、やさしい甘さの焼き菓子セットです。",
    price: 2100,
    category: "食品",
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80",
    stock: 9,
    rating: 4.6,
  },
];
