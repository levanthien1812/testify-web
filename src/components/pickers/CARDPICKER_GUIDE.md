# CardPicker Component Documentation

A reusable, flexible card picker component for single and multiple selections.

## Features

✅ **Single & Multiple Selection** - Choose selection mode based on use case
✅ **Flexible Card Rendering** - Use any component/JSX for card display
✅ **Select All / Clear All** - Built-in bulk actions for multi-select
✅ **Generic Type Support** - Works with any data structure
✅ **Fully Customizable** - Grid columns, labels, buttons, styling
✅ **Accessible** - Proper keyboard interaction (inherited from DOM)

## Installation

The component is located at: `src/components/pickers/CardPicker.tsx`

## Props

| Prop                     | Type                                          | Default                  | Description                                                          |
| ------------------------ | --------------------------------------------- | ------------------------ | -------------------------------------------------------------------- |
| `items`                  | `T[]`                                         | Required                 | Array of items to choose from                                        |
| `selectedIds`            | `string[]`                                    | Required                 | Array of currently selected item IDs                                 |
| `onSelectionChange`      | `(ids: string[]) => void`                     | Required                 | Callback when selection changes                                      |
| `renderCard`             | `(item: T) => ReactNode`                      | Required                 | Function to render card content (picker handles selection indicator) |
| `getItemId`              | `(item: T) => string`                         | Required                 | Function to extract ID from item                                     |
| `multiSelect`            | `boolean`                                     | `true`                   | Enable multiple selection mode                                       |
| `gridCols`               | `number`                                      | `3`                      | Number of grid columns                                               |
| `showSelectAllButton`    | `boolean`                                     | `true`                   | Show select/clear all buttons (multi-select only)                    |
| `selectAllLabel`         | `string`                                      | `"Select All"`           | Label for select all button                                          |
| `clearAllLabel`          | `string`                                      | `"Clear All"`            | Label for clear all button                                           |
| `emptyMessage`           | `string`                                      | `"No items available"`   | Message when no items exist                                          |
| `renderIndicator`        | `(item: T, isSelected: boolean) => ReactNode` | Optional                 | Custom selection indicator                                           |
| `selectedCardClassName`  | `string`                                      | `"ring-2 ring-blue-500"` | CSS class for selected cards                                         |
| `cardContainerClassName` | `string`                                      | `"cursor-pointer"`       | CSS class for card container                                         |
| `containerClassName`     | `string`                                      | `""`                     | CSS class for main container                                         |
| `gridClassName`          | `string`                                      | `""`                     | CSS class for grid (overrides default)                               |

## Usage Examples

### Example 1: Single Selection (Bank Picker)

```tsx
import CardPicker from "@/components/pickers/CardPicker";
import { QuestionBankItf } from "@/types/questionBank";

const [selectedBank, setSelectedBank] = useState<QuestionBankItf | null>(null);

<CardPicker
    items={banks}
    selectedIds={selectedBank ? [selectedBank.id] : []}
    onSelectionChange={(ids) => {
        const bank = banks.find((b) => b.id === ids[0]);
        setSelectedBank(bank || null);
    }}
    getItemId={(bank) => bank.id}
    renderCard={(bank) => (
        <div className="p-4 rounded-lg bg-blue-50">
            <h3 className="font-bold">{bank.name}</h3>
            <p className="text-sm text-gray-600">
                {bank.questions.length} questions
            </p>
        </div>
    )}
    multiSelect={false}
    gridCols={3}
    showSelectAllButton={false}
    selectedCardClassName="ring-2 ring-blue-500"
/>;
```

### Example 2: Multiple Selection (Questions Picker)

```tsx
import CardPicker from "@/components/pickers/CardPicker";

const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

<CardPicker
    items={questions}
    selectedIds={selectedQuestionIds}
    onSelectionChange={setSelectedQuestionIds}
    getItemId={(q) => q.id}
    renderCard={(question) => (
        <div className="p-4 rounded-lg border-2 border-gray-200 bg-white">
            <p className="font-semibold">{question.text}</p>
            <p className="text-xs text-gray-500 mt-1">Type: {question.type}</p>
        </div>
    )}
    multiSelect={true}
    selectAllLabel="Add All"
    clearAllLabel="Remove All"
    selectedCardClassName="border-2 border-green-500 bg-green-50"
/>;
```

### Example 3: Complex Item Structure

```tsx
interface User {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
}

const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

<CardPicker
    items={users}
    selectedIds={selectedUserIds}
    onSelectionChange={setSelectedUserIds}
    getItemId={(user) => user.userId}
    renderCard={(user) => (
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-300">
            {user.avatar && (
                <img
                    src={user.avatar}
                    alt={user.firstName}
                    className="w-full h-20 object-cover rounded mb-2"
                />
            )}
            <p className="font-bold">
                {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-600">{user.email}</p>
        </div>
    )}
    multiSelect={true}
    gridCols={2}
    selectedCardClassName="bg-purple-100 border-2 border-purple-500"
/>;
```

### Example 4: With Custom Styling

```tsx
<CardPicker
    items={items}
    selectedIds={selectedIds}
    onSelectionChange={setSelectedIds}
    getItemId={(item) => item.id}
    renderCard={(item) => <div>{item.name}</div>}
    gridCols={4}
    containerClassName="p-6 bg-gray-50 rounded-lg"
    gridClassName="grid grid-cols-4 gap-4"
    selectAllLabel="Select All Items"
    clearAllLabel="Clear Selection"
/>
```

### Example 5: With Disabled State (Conditional Selection)

```tsx
<CardPicker
    items={questions}
    selectedIds={selectedQuestionIds}
    onSelectionChange={(ids) => {
        // Add logic to prevent certain selections
        const filtered = ids.filter((id) => {
            const question = questions.find((q) => q.id === id);
            return !question?.isLocked; // Prevent selecting locked questions
        });
        setSelectedQuestionIds(filtered);
    }}
    getItemId={(q) => q.id}
    renderCard={(question) => (
        <div className={`p-3 rounded ${question.isLocked ? "opacity-50" : ""}`}>
            {question.title}
            {question.isLocked && (
                <span className="text-xs ml-2">🔒 Locked</span>
            )}
        </div>
    )}
    renderIndicator={(question, isSelected) => {
        if (question.isLocked) return null;
        return isSelected ? "✓" : null;
    }}
    cardContainerClassName={`cursor-pointer ${question.isLocked ? "cursor-not-allowed" : ""}`}
    multiSelect={true}
/>
```

## Migration Guide

### From PickBank to CardPicker

**Before:**

```tsx
const PickBank = ({ banks, onSelectBank, selectedBank }) => {
    const handleClickBank = (bank) => {
        onSelectBank(bank);
    };

    return (
        <div>
            <p>Choose a bank:</p>
            <div className="grid grid-cols-3 gap-2">
                {banks.map((bank) => (
                    <div
                        onClick={() => handleClickBank(bank)}
                        key={bank.id}
                        className={`cursor-pointer relative px-4 py-2 rounded-lg 
              ${selectedBank?.id === bank.id ? "border border-orange-500" : ""}`}
                    >
                        {/* card content */}
                    </div>
                ))}
            </div>
        </div>
    );
};
```

**After:**

```tsx
const PickBank = ({ banks, onSelectBank, selectedBank }) => (
    <div>
        <p>Choose a bank:</p>
        <CardPicker
            items={banks}
            selectedIds={selectedBank ? [selectedBank.id] : []}
            onSelectionChange={(ids) => {
                const bank = banks.find((b) => b.id === ids[0]);
                onSelectBank(bank || null);
            }}
            getItemId={(bank) => bank.id}
            renderCard={(bank) => (
                <div className="px-4 py-2 rounded-lg">
                    {/* card content only, no indicator logic */}
                </div>
            )}
            multiSelect={false}
            gridCols={3}
            showSelectAllButton={false}
            selectedCardClassName="ring-2 ring-orange-600"
        />
    </div>
);
```

## Best Practices

1. **Keep renderCard simple** - It should only render card content, not selection logic:

    ```tsx
    // ✅ Good - just content
    renderCard={(item) => <div>{item.name}</div>}

    // ❌ Avoid - logic belongs outside
    renderCard={(item, isSelected) => <div className={isSelected ? "ring" : ""}>...</div>}
    ```

2. **Use selectedCardClassName for styling** - Let CardPicker handle the selection state:

    ```tsx
    selectedCardClassName = "ring-2 ring-blue-500 bg-blue-50";
    ```

3. **Customize indicator only when needed** - Most cases work with the default checkmark:

    ```tsx
    // Optional: custom indicator for special cases
    renderIndicator={(item, isSelected) =>
      item.locked ? null : <CustomIcon />
    }
    ```

4. **For complex state logic**, filter/disable items before passing to CardPicker:

    ```tsx
    const availableItems = items.filter(item => !item.locked);
    <CardPicker items={availableItems} ... />
    ```

5. **Memoize render functions** for performance with large lists:

    ```tsx
    const renderCard = useCallback((item) => <Card item={item} />, []);
    ```

6. **Use proper key extraction**:

    ```tsx
    // Good - always returns unique ID
    getItemId={(item) => item.id}

    // Avoid - using index can cause issues
    getItemId={(item, index) => index}
    ```

7. **Handle empty states gracefully**:

    ```tsx
    <CardPicker
        items={items}
        emptyMessage={loading ? "Loading..." : "No items found"}
        // ...
    />
    ```

8. **For responsive grids**, use tailwind responsive classes:
    ```tsx
    gridClassName =
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
    ```

## Component Location

`src/components/pickers/CardPicker.tsx`

## Related Components

- PickBank.refactored.tsx - Single select example
- PickQuestionsFromBank.refactored.tsx - Multi-select example
