
import Image from "next/image";
import { useState, useMemo } from "react";

interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    size: string;
    color: string;
    quantity: number;
}

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    trending: boolean;
    dateAdded: Date;
    sizes: string[];
    colors: string[];
}

const products: Product[] = [
    { id: 1, name: "Acme Slip-On Shoes", price: 45.00, image: "/shoes-1.avif", category: "footwear", trending: true, dateAdded: new Date('2024-01-15'), sizes: ["7", "8", "9", "10", "11"], colors: ["Black", "White", "Brown"] },
    { id: 2, name: "Acme Circles T-Shirt", price: 20.00, image: "/tshirt-1.avif", category: "shirts", trending: false, dateAdded: new Date('2024-02-10'), sizes: ["XS", "S", "M", "L", "XL"], colors: ["Black", "White", "Navy", "Gray"] },
    { id: 3, name: "Acme Drawstring Bag", price: 12.00, image: "/bag-1-dark.avif", category: "bags", trending: true, dateAdded: new Date('2024-03-05'), sizes: ["One Size"], colors: ["Black", "Navy", "Gray"] },
    { id: 4, name: "Acme Cup", price: 15.00, image: "/cup-black.avif", category: "drinkware", trending: false, dateAdded: new Date('2024-01-20'), sizes: ["One Size"], colors: ["Black", "White", "Blue"] },
    { id: 5, name: "Acme Hoodie", price: 55.00, image: "/hoodie-1.avif", category: "hoodies", trending: true, dateAdded: new Date('2024-03-12'), sizes: ["XS", "S", "M", "L", "XL", "XXL"], colors: ["Black", "Gray", "Navy", "Red"] },
    { id: 6, name: "Acme Hat", price: 25.00, image: "/hat-1.avif", category: "headwear", trending: false, dateAdded: new Date('2024-02-25'), sizes: ["One Size"], colors: ["Black", "White", "Navy", "Khaki"] },
    { id: 7, name: "Acme Mug", price: 18.00, image: "/mug-1.avif", category: "drinkware", trending: false, dateAdded: new Date('2024-01-08'), sizes: ["One Size"], colors: ["White", "Black", "Blue"] },
    { id: 8, name: "Acme Sticker", price: 5.00, image: "/sticker.avif", category: "stickers", trending: true, dateAdded: new Date('2024-03-18'), sizes: ["One Size"], colors: ["Multi"] },
    { id: 9, name: "Acme Keyboard", price: 120.00, image: "/keyboard.avif", category: "electronics", trending: false, dateAdded: new Date('2024-02-15'), sizes: ["One Size"], colors: ["Black", "White"] },
    { id: 10, name: "Baby Cap", price: 15.00, image: "/baby-cap-black.avif", category: "kids", trending: false, dateAdded: new Date('2024-01-30'), sizes: ["6-12M", "12-18M", "18-24M"], colors: ["Black", "Pink", "Blue"] },
    { id: 11, name: "Dog Sweater", price: 35.00, image: "/dog-sweater-1.avif", category: "pets", trending: true, dateAdded: new Date('2024-03-20'), sizes: ["XS", "S", "M", "L"], colors: ["Red", "Blue", "Black"] },
    { id: 12, name: "Pacifier", price: 8.00, image: "/pacifier-1.avif", category: "kids", trending: false, dateAdded: new Date('2024-02-05'), sizes: ["0-6M", "6-18M"], colors: ["Pink", "Blue", "Green"] },
    { id: 13, name: "Spiral T-Shirt", price: 22.00, image: "/t-shirt-spiral-1.avif", category: "shirts", trending: false, dateAdded: new Date('2024-03-25'), sizes: ["XS", "S", "M", "L", "XL"], colors: ["Black", "White", "Gray"] },
    { id: 14, name: "Rainbow Sticker", price: 6.00, image: "/sticker-rainbow.avif", category: "stickers", trending: true, dateAdded: new Date('2024-03-28'), sizes: ["One Size"], colors: ["Multi"] },
    { id: 15, name: "Cowboy Hat", price: 40.00, image: "/cowboy-hat-black-1.avif", category: "headwear", trending: false, dateAdded: new Date('2024-01-12'), sizes: ["S", "M", "L", "XL"], colors: ["Black", "Brown", "Tan"] },
];

const categories = [
    { name: "All", value: "all" },
    { name: "Bags", value: "bags" },
    { name: "Drinkware", value: "drinkware" },
    { name: "Electronics", value: "electronics" },
    { name: "Footwear", value: "footwear" },
    { name: "Headwear", value: "headwear" },
    { name: "Hoodies", value: "hoodies" },
    { name: "Jackets", value: "jackets" },
    { name: "Kids", value: "kids" },
    { name: "Pets", value: "pets" },
    { name: "Shirts", value: "shirts" },
    { name: "Stickers", value: "stickers" },
];

const sortOptions = [
    { name: "Relevance", value: "relevance" },
    { name: "Trending", value: "trending" },
    { name: "Latest arrivals", value: "latest" },
    { name: "Price: Low to high", value: "price-asc" },
    { name: "Price: High to low", value: "price-desc" },
];

export default function Shop() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("relevance");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const filteredAndSortedProducts = useMemo(() => {
        // First filter by category
        let filtered = selectedCategory === "all"
            ? products
            : products.filter(product => product.category === selectedCategory);

        // Then filter by search query
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Then sort
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "trending":
                    // Trending items first, then by name
                    if (a.trending && !b.trending) return -1;
                    if (!a.trending && b.trending) return 1;
                    return a.name.localeCompare(b.name);

                case "latest":
                    // Most recent first
                    return b.dateAdded.getTime() - a.dateAdded.getTime();

                case "price-asc":
                    return a.price - b.price;

                case "price-desc":
                    return b.price - a.price;

                case "relevance":
                default:
                    // For search results, prioritize name matches, otherwise alphabetical
                    if (searchQuery.trim() !== "") {
                        const aNameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
                        const bNameMatch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
                        if (aNameMatch && !bNameMatch) return -1;
                        if (!aNameMatch && bNameMatch) return 1;
                    }
                    return a.name.localeCompare(b.name);
            }
        });

        return sorted;
    }, [selectedCategory, sortBy, searchQuery]);

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setSelectedSize("");
        setSelectedColor("");
    };

    const handleAddToCart = () => {
        if (!selectedProduct || !selectedSize || !selectedColor) return;

        const existingItemIndex = cart.findIndex(
            item => item.id === selectedProduct.id &&
                item.size === selectedSize &&
                item.color === selectedColor
        );

        if (existingItemIndex >= 0) {
            const updatedCart = [...cart];
            updatedCart[existingItemIndex].quantity += 1;
            setCart(updatedCart);
        } else {
            const newItem: CartItem = {
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                image: selectedProduct.image,
                size: selectedSize,
                color: selectedColor,
                quantity: 1,
            };
            setCart([...cart, newItem]);
        }

        setSelectedProduct(null);
        setSelectedSize("");
        setSelectedColor("");
    };

    const removeFromCart = (index: number) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    const updateQuantity = (index: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(index);
            return;
        }
        const updatedCart = [...cart];
        updatedCart[index].quantity = newQuantity;
        setCart(updatedCart);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <div className="w-full min-h-screen bg-[rgba(23,23,23,1)]">
            {/* Header - Responsive */}
            <div className={`w-full flex flex-col sm:flex-row justify-between sticky bg-[rgba(23,23,23,1)] min-h-[80px] sm:h-[100px] items-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-64 border-b-[rgba(53,53,53,1)] border-b-2 ${
                (selectedProduct || isCartOpen) ? 'blur-sm brightness-50' : ''
            }`}>
                <div className="items-center flex flex-row gap-3 sm:gap-7 justify-between w-full sm:w-auto">
                    <div className="flex items-center gap-3 sm:gap-7">
                        <a href="#">
                            <Image src="/vercel.svg" alt="logo" width={24} height={24}/>
                        </a>
                        <span className="font-sans text-lg sm:text-xl text-white font-bold">ACME</span>
                    </div>
                    <div className="items-center flex flex-row gap-4 sm:gap-7">
                        <a href="/" className="no-underline text-white cursor-pointer text-sm sm:text-base">Home</a>
                        <a href="/shop" className="no-underline text-white cursor-pointer text-sm sm:text-base">Shop</a>
                    </div>
                </div>
                <div className="items-center flex flex-row gap-3 mt-2 sm:mt-0">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="no-underline text-white cursor-pointer bg-[rgba(43,43,43,1)] p-2.5 border-[rgba(53,53,53,1)] border-2 rounded-[10px] flex items-center gap-2 relative"
                    >
                        <Image
                            src="/shopping-cart.png"
                            alt="Shopping cart"
                            width={20}
                            height={20}
                            className="filter invert"
                        />
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                {getTotalItems()}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Product Selection Modal - Responsive */}
            {selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-[rgba(23,23,23,1)] border border-[rgba(53,53,53,1)] rounded-lg p-4 sm:p-8 max-w-sm sm:max-w-md w-full mx-4 relative z-10 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-white text-lg sm:text-xl font-bold">{selectedProduct.name}</h2>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="aspect-square bg-black relative flex items-center justify-center p-4 rounded-lg mb-4">
                                <Image
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                            <p className="text-blue-400 text-lg font-semibold">${selectedProduct.price.toFixed(2)} USD</p>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-6">
                            <h3 className="text-white font-semibold mb-3">Size</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {selectedProduct.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`p-2 rounded border text-sm ${
                                            selectedSize === size
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-[rgba(43,43,43,1)] text-white border-[rgba(53,53,53,1)] hover:border-gray-400"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div className="mb-6">
                            <h3 className="text-white font-semibold mb-3">Color</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {selectedProduct.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`p-2 rounded border text-sm ${
                                            selectedColor === color
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-[rgba(43,43,43,1)] text-white border-[rgba(53,53,53,1)] hover:border-gray-400"
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedSize || !selectedColor}
                            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                                selectedSize && selectedColor
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            )}

            {/* Cart Modal - Responsive */}
            {isCartOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-[rgba(23,23,23,1)] border border-[rgba(53,53,53,1)] rounded-lg p-4 sm:p-8 max-w-sm sm:max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-white text-lg sm:text-xl font-bold">Shopping Cart ({getTotalItems()} items)</h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Your cart is empty</p>
                        ) : (
                            <>
                                <div className="space-y-4 mb-6">
                                    {cart.map((item, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[rgba(43,43,43,1)] p-4 rounded-lg">
                                            <div className="w-16 h-16 relative flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-semibold text-sm sm:text-base">{item.name}</h3>
                                                <p className="text-gray-400 text-xs sm:text-sm">Size: {item.size}, Color: {item.color}</p>
                                                <p className="text-blue-400 font-semibold text-sm sm:text-base">${item.price.toFixed(2)} USD</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => updateQuantity(index, item.quantity - 1)}
                                                    className="bg-[rgba(53,53,53,1)] text-white w-8 h-8 rounded hover:bg-gray-600"
                                                >
                                                    -
                                                </button>
                                                <span className="text-white w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(index, item.quantity + 1)}
                                                    className="bg-[rgba(53,53,53,1)] text-white w-8 h-8 rounded hover:bg-gray-600"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(index)}
                                                className="text-red-400 hover:text-red-300 text-sm sm:text-base flex-shrink-0"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-[rgba(53,53,53,1)] pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-white font-semibold text-lg">Total:</span>
                                        <span className="text-blue-400 font-bold text-xl">${getTotalPrice().toFixed(2)} USD</span>
                                    </div>
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
                                        Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Shop Content - Responsive Layout */}
            <div className={`flex flex-col lg:flex-row ${(selectedProduct || isCartOpen) ? 'blur-sm brightness-50' : ''}`}>
                {/* Mobile Filter Button */}
                <div className="lg:hidden p-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="bg-[rgba(43,43,43,1)] text-white px-4 py-2 rounded-lg border border-[rgba(53,53,53,1)]"
                    >
                        {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {/* Categories Sidebar - Responsive */}
                <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 p-4 lg:p-8 border-r-0 lg:border-r border-b lg:border-b-0 border-[rgba(53,53,53,1)]`}>
                    <div className="text-white">
                        <h3 className="text-lg font-bold mb-4">Collections</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.value}
                                    onClick={() => {
                                        setSelectedCategory(category.value);
                                        setIsSidebarOpen(false); // Close sidebar on mobile after selection
                                    }}
                                    className={`block w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                                        selectedCategory === category.value
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-300 hover:text-white hover:bg-[rgba(43,43,43,1)]"
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="mt-8 text-white">
                        <h3 className="text-lg font-bold mb-4">Sort by</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSortBy(option.value);
                                        setIsSidebarOpen(false); // Close sidebar on mobile after selection
                                    }}
                                    className={`block w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                                        sortBy === option.value
                                            ? "text-blue-400 bg-[rgba(43,43,43,0.5)]"
                                            : "text-gray-400 hover:text-white hover:bg-[rgba(43,43,43,1)]"
                                    } cursor-pointer`}
                                >
                                    {option.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid - Responsive */}
                <div className="flex-1 p-4 lg:p-8">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-full sm:max-w-md">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 pl-10 bg-[rgba(43,43,43,1)] border border-[rgba(53,53,53,1)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Results Info */}
                    <div className="mb-4 text-gray-400 text-sm">
                        {searchQuery && (
                            <p>
                                Showing {filteredAndSortedProducts.length} results for "{searchQuery}"
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="ml-2 text-blue-400 hover:text-blue-300 underline"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </p>
                        )}
                    </div>

                    {/* Products Grid */}
                    {filteredAndSortedProducts.length === 0 ? (
                        <div className="text-center text-gray-400 py-12">
                            <p className="text-lg sm:text-xl mb-2">No products found</p>
                            <p className="text-sm sm:text-base">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                            {filteredAndSortedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-black rounded-lg border border-[rgba(53,53,53,1)] overflow-hidden hover:border-gray-500 transition-colors cursor-pointer"
                                    onClick={() => handleProductClick(product)}
                                >
                                    <div className="aspect-square bg-black relative flex items-center justify-center p-4 sm:p-8">
                                        <div className="w-full h-full rounded-lg flex items-center justify-center relative overflow-hidden">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        {product.trending && (
                                            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-600 px-2 py-1 rounded text-white text-xs font-semibold">
                                                TRENDING
                                            </div>
                                        )}
                                        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black px-2 py-1 rounded text-white text-xs sm:text-sm">
                                            {product.name}
                                        </div>
                                        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-blue-600 px-2 sm:px-3 py-1 rounded text-white text-xs sm:text-sm font-semibold">
                                            ${product.price.toFixed(2)} USD
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer - Responsive */}
            <footer className={`w-full bg-black border-t border-[rgba(53,53,53,1)] px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-64 py-8 sm:py-16 ${(selectedProduct || isCartOpen) ? 'blur-sm brightness-50' : ''}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* Company Info */}
                    <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2">
                            <Image src="/vercel.svg" alt="logo" width={24} height={24}/>
                            <span className="text-white font-bold text-lg">ACME</span>
                        </div>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Your one-stop shop for quality products and exceptional service.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold">Quick Links</h3>
                        <div className="space-y-2">
                            <a href="/" className="block text-gray-400 hover:text-white transition-colors no-underline text-sm sm:text-base">Home</a>
                            <a href="/shop" className="block text-gray-400 hover:text-white transition-colors no-underline text-sm sm:text-base">Shop</a>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-[rgba(53,53,53,1)] mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm sm:text-base text-center md:text-left">© 2025 ACME. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}