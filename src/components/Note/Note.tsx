import { useMemo, useState } from 'react';
import { DATE_FORMAT, HASHTAG_REGEX } from '../../entities/constants';
import { Note as NoteInterface } from '../../entities/interfaces';
import { Icon } from '@iconify/react';
import { Tag } from '../Tag';
import { createEditor, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import Tooltip from '@mui/material/Tooltip';
import classNames from 'classnames';

import './Note.scss';
import { NoteEventTypes } from '../../entities/enums';

const Leaf = ({ attributes, children, leaf }: any) => (
    <span className={classNames({ 'highlighted': leaf.variable })} {...attributes}>
        {children}
    </span>
);


const decorate = ([node, path]: any) => {
    if (!Text.isText(node)) return [];

    const ranges = [];
    let match = null;

    while ((match = HASHTAG_REGEX.exec(node.text)) !== null) {
        ranges.push({
            variable: true,
            anchor: { path, offset: match.index },
            focus: { path, offset: match.index + match[0].length },
        });
    }

    return ranges;
};


export const Note = (props: { note: NoteInterface, createMode?: boolean, noteEvent: (eventType: NoteEventTypes, id?: string, newDescription?: string, newTitle?: string, date?: string) => void; }) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [titleValue, setTitleValue] = useState<string>(props.note.title);
    const [inputValue, setInputValue] = useState([
        {
            type: "paragraph",
            children: [{ text: props.note.description }],
        }
    ]);

    const editor = useMemo(() => withReact(createEditor()), []);

    const saveNote = () => {
        if (editMode && inputValue[0].children[0].text && titleValue) {
            props.noteEvent(NoteEventTypes.Edit, props.note.id, inputValue[0].children[0].text, titleValue);
            setEditMode(false);
        }
        else { //createMode
            if (inputValue[0].children[0].text) {
                props.noteEvent(NoteEventTypes.Create, props.note.id, inputValue[0].children[0].text, titleValue, props.note.date);
            }
        }
    }

    const cancel = () => {
        if (editMode) {
            setInputValue([{
                type: "paragraph",
                children: [{ text: props.note.description }],
            }]);
            setTitleValue(props.note.title);
            setEditMode(false);
        }
        else {
            props.noteEvent(NoteEventTypes.CancelCreating);
        }
    }

    const deleteNote = () => {
        props.noteEvent(NoteEventTypes.Delete, props.note.id)
    }

    const changeNoteStatus = () => {
        props.noteEvent(NoteEventTypes.ChangeStatus, props.note.id)
    }

    return (
        <div className={classNames('note', { 'disabled': props.note.done })}>
            <div className='note-top'>
                <p className='note-top-date'>
                    {new Date(props.note.date).toLocaleString('ru', DATE_FORMAT)}
                </p>
                <div className='note-top-buttons'>
                    {editMode || props.createMode ?
                        <>
                            <Tooltip title={editMode ? 'finish editing' : 'finish creating'} placement="top">
                                <button
                                    type='button'
                                    className={classNames('note-top-buttons-item note-top-buttons-item-done', 'active', { 'inactive': !(inputValue[0].children[0].text && titleValue) })}
                                    onClick={() => saveNote()}
                                >
                                    <Icon className={classNames('note-icon')} icon="material-symbols:done-rounded" />
                                </button>
                            </Tooltip>
                            <Tooltip title={editMode ? 'cancel editing' : 'cancel creating'} placement="top">
                                <button
                                    type='button'
                                    onClick={() => cancel()}
                                    className={classNames('note-top-buttons-item note-top-buttons-item-cancel', 'active')}
                                >
                                    <Icon className='note-icon' icon="radix-icons:cross-2" />
                                </button>
                            </Tooltip>
                        </>
                        :
                        <>
                            <Tooltip title={props.note.done ? 'mark as undone' : 'mark as done'} placement="top">
                                <button
                                    type='button'
                                    onClick={() => changeNoteStatus()}
                                    className={classNames('note-top-buttons-item note-top-buttons-item-done', { 'done': props.note.done })}
                                >
                                    <Icon className='note-icon' icon="material-symbols:done-rounded" />
                                </button>
                            </Tooltip>

                            {!props.note.done &&
                                <Tooltip title='edit' placement="top">
                                    <button
                                        type='button'
                                        onClick={() => setEditMode(!editMode)}
                                        className={classNames('note-top-buttons-item note-top-buttons-item-edit', { 'active': editMode })}
                                    >
                                        <Icon className='note-icon' icon="material-symbols:edit" />
                                    </button>
                                </Tooltip>}
                            <Tooltip title='delete' placement="top">
                                <button
                                    type='button'
                                    onClick={() => deleteNote()}
                                    className='note-top-buttons-item note-top-buttons-item-delete'
                                >
                                    <Icon className='note-icon' icon="ph:trash-simple-bold" />
                                </button>
                            </Tooltip>
                        </>
                    }
                </div>
            </div>
            <div className='note-bottom'>
                {editMode || props.createMode ?
                    <div className='note-bottom-content'>
                        <input
                            type='text'
                            className="note-bottom-content-title-input"
                            value={titleValue}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitleValue(e.target.value)} />
                        <div className='note-bottom-content-text-input'>
                            <Slate
                                editor={editor}
                                value={inputValue}
                                onChange={setInputValue as any}

                            >
                                <Editable
                                    decorate={decorate}
                                    renderLeaf={Leaf}
                                    className="input"
                                />
                            </Slate>
                        </div>

                    </div>
                    :
                    <div className='note-bottom-content'>
                        <p className='note-bottom-content-title'>
                            {props.note.title}
                        </p>
                        <p className={classNames('note-bottom-content-text', { 'edit-mode': editMode })}>
                            {props.note.description}
                        </p>
                    </div>}
            </div>
            <div className='note-bottom-tags'>
                <hr />
                <div className='note-bottom-tags-container'>
                    {props.note.tags.sort().map((tag) => <Tag tag={tag} />)}
                </div>
            </div>
        </div>

    );
}
