import { useEffect, useRef, useState } from 'react';
import { Note } from '../../components/Note';
import data from '../../data.json';
import { Note as NoteInterface } from '../../entities/interfaces';
import { findTags, subArrInArr } from '../../entities/helpers';
import { v4 as uuid } from 'uuid';
import Tooltip from '@mui/material/Tooltip';
import { Icon } from '@iconify/react';
import './MainPage.scss';
import { NoteEventTypes } from '../../entities/enums';
import { TagSearch } from '../../components/TagSearch';


export const MainPage = () => {
    const [notes, setNotes] = useState<NoteInterface[]>(JSON.parse(localStorage.getItem('notes')!));
    const [filteredNotes, setFilteredNotes] = useState<NoteInterface[]>(JSON.parse(localStorage.getItem('notes')!));
    const [tags, setTags] = useState<string[]>(JSON.parse(localStorage.getItem('tags')!));
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [createMode, setCreateMode] = useState<boolean>(false);
    const notesContainer = useRef<HTMLDivElement>(document.createElement('div'));

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('notes')!)) {
            localStorage.setItem('notes', JSON.stringify(data.notes));
            localStorage.setItem('tags', JSON.stringify(data.tags));
            setNotes(JSON.parse(localStorage.getItem('notes')!));
            setTags(JSON.parse(localStorage.getItem('tags')!));
        }
    }, []);

    useEffect(() => {
        updateFilteredNotes();
    }, [notes, selectedTags]);


    const noteEvent = (eventType: NoteEventTypes, id?: string, newDescription?: string, newTitle?: string, date?: string) => {
        let newNotes: NoteInterface[];
        let newTags: string[];

        if (eventType === NoteEventTypes.Edit) {
            newNotes = notes.map((note: NoteInterface) => {
                if (note.id === id) {
                    note.description = newDescription!;
                    note.title = newTitle!;
                    note.tags = findTags(note.description);
                    setCreateMode(false);
                }
                return note;
            });
        }
        else if (eventType === NoteEventTypes.ChangeStatus) {
            newNotes = notes.map((note: NoteInterface) => {
                if (note.id === id) {
                    note.done = !note.done;
                }
                return note;
            });
        }
        else if (eventType === NoteEventTypes.Create) {
            let newNote: NoteInterface = {
                id: id!,
                date: date!,
                title: newTitle!,
                description: newDescription!,
                tags: findTags(newDescription!),
                done: false,
            };
            newNotes = notes;
            newNotes.unshift(newNote);
            setCreateMode(false);
        }
        else if (eventType === NoteEventTypes.Delete) {
            newNotes = notes.filter((note: NoteInterface) => note.id !== id);
        }
        else { //cancel creating
            setCreateMode(false);
            newNotes = notes;
        }
        newTags = findTags(newNotes.map((note) => note.description).join(' '));
        const uniqueNewTags = newTags.filter(function (item, pos) {
            return newTags.indexOf(item) === pos;
        })
        localStorage.setItem('notes', JSON.stringify(newNotes));
        localStorage.setItem('tags', JSON.stringify(uniqueNewTags));
        setTags(uniqueNewTags);
        setNotes(newNotes);
        updateFilteredNotes();
    };

    const updateFilteredNotes = () => {
        if (notes) {
            let newFilteredNotes: NoteInterface[] = [];
            newFilteredNotes = notes.filter((note) => subArrInArr(note.tags, selectedTags));
            setFilteredNotes([...newFilteredNotes]);
        }
    }

    const addNote = () => {
        setCreateMode(true);
        notesContainer.current.scrollIntoView();
    }

    return (
        <div className='main'>
            <div className='main-topbar'>
                <TagSearch tags={tags} tagsSelected={setSelectedTags}></TagSearch>
                <Tooltip title='add note' placement='bottom'>
                    <button type='button' className='main-topbar-button' onClick={() => addNote()}>
                        <Icon className='main-topbar-button-icon' icon='ph:plus-bold' />
                    </button>
                </Tooltip>
            </div>
            <div className='notes-wrapper'>
                <div ref={notesContainer} className='notes'>
                    {createMode && <Note note={{
                        id: uuid(),
                        date: (new Date()).toISOString(),
                        title: '',
                        description: '',
                        tags: [],
                        done: false,
                    }} createMode={true} noteEvent={noteEvent} />}
                    {filteredNotes && filteredNotes.map((note: NoteInterface) => <Note note={note} noteEvent={noteEvent} key={note.id} />)}
                </div>
            </div>
        </div>
    )
}