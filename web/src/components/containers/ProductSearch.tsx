import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type ProductSearchProps = {
  searchTerm: string;
  selectedCategory: string;
  categories: string[];
  resultCount: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

export function ProductSearch({
  searchTerm,
  selectedCategory,
  categories,
  resultCount,
  onSearchChange,
  onCategoryChange,
}: ProductSearchProps) {
  return (
    <section className="panel search-panel">
      <div className="search-panel__header">
        <div>
          <h2 className="section-title">検索と絞り込み</h2>
          <p className="section-caption">
            キーワードとカテゴリで商品を探せます。
          </p>
        </div>
        <p className="section-caption">検索結果: {resultCount} 件</p>
      </div>

      <div className="search-grid">
        <Input
          id="product-search"
          label="キーワード"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="商品名や説明で検索"
          value={searchTerm}
        />

        <Select
          id="product-category"
          label="カテゴリ"
          onChange={(event) => onCategoryChange(event.target.value)}
          options={categories.map((category) => ({
            label: category,
            value: category,
          }))}
          value={selectedCategory}
        />
      </div>
    </section>
  );
}
