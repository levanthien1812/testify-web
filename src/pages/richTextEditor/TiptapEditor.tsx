// src/TextEditor.js
import "./styles.scss";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import {
    Editor,
    EditorContextValue,
    EditorProvider,
    useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MouseEventHandler, ReactNode, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faA,
    faArrowTurnDown,
    faBold,
    faCode,
    faItalic,
    faListOl,
    faListUl,
    faRedo,
    faStrikethrough,
    faUndo,
} from "@fortawesome/free-solid-svg-icons";

type EditorButtonProps = {
    children: ReactNode;
    onClick: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    className?: string;
};

const EditorButton = ({
    children,
    onClick,
    disabled,
    className,
}: EditorButtonProps) => {
    return (
        <button
            className={`border w-fit px-2 min-w-8 shrink-0 justify-center text-nowrap flex items-center py-2 text-sm leading-none border-black active:bg-orange-600 active:text-white ${
                className === "is-active"
                    ? "bg-orange-600 text-white"
                    : "bg-white text-black"
            }`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

const MenuBar = ({
    withInsertGapButton = false,
}: {
    withInsertGapButton: boolean;
}) => {
    const { editor } = useCurrentEditor();

    useEffect(() => {
        if (editor && editor.isEditable) {
            editor.commands.focus();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex gap-1 items-start mb-2 overflow-x-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
            {withInsertGapButton && (
                <EditorButton
                    onClick={() =>
                        editor.chain().focus().insertContent("___").run()
                    }
                    disabled={
                        !editor.can().chain().focus().insertContent("___").run()
                    }
                >
                    Insert Gap
                </EditorButton>
            )}
            <EditorButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faBold} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faItalic} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faStrikethrough} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={editor.isActive("code") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faCode} />
            </EditorButton>

            <EditorButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faListUl} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faListOl} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive("codeBlock") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faCode} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().setHardBreak().run()}
            >
                <FontAwesomeIcon icon={faArrowTurnDown} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                <FontAwesomeIcon icon={faUndo} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
            >
                <FontAwesomeIcon icon={faRedo} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().setColor("#958DF1").run()}
                className={
                    editor.isActive("textStyle", { color: "#958DF1" })
                        ? "is-active"
                        : ""
                }
            >
                <FontAwesomeIcon icon={faA} className="text-purple-600" />
            </EditorButton>
        </div>
    );
};

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure(),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
    }),
];

type TextEditorProps = {
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    withInsertGapButton?: boolean;
};

const TextEditor = ({
    content,
    setContent,
    withInsertGapButton = false,
}: TextEditorProps) => {
    return (
        <EditorProvider
            slotBefore={<MenuBar withInsertGapButton={withInsertGapButton} />}
            extensions={extensions}
            content={content}
            onUpdate={(e) => {
                setContent(e.editor.getHTML());
            }}
            editorProps={{
                attributes: {
                    class: "border border-black outline-none px-4 py-1 focus:border-orange-600 bg-white h-14",
                },
            }}
        ></EditorProvider>
    );
};

export default TextEditor;
