import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { sortTagsBySearch } from '../../entities/helpers';
import { Tag } from '../Tag/Tag';
import './TagSearch.scss';

export const TagSearch = (props: { tags: string[], tagsSelected?: (selectedTags: string[]) => void }) => {
    const [showTags, setShowTags] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>(props.tags);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const tagsWrapper = useRef(document.createElement('div'));
    const input = useRef(document.createElement('input'));

    useEffect(() => {
        props.tagsSelected!(selectedTags);

    }, [selectedTags]);

    useEffect(() => {
        const onClick = (e: any) => {
            if (!(tagsWrapper.current?.contains(e.target) || input.current?.contains(e.target))) {
                setShowTags(false)
            }
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

    useEffect(() => {
        if (props.tags) {
            setTags(sortTagsBySearch(props.tags, inputValue));
        }
    }, [props.tags, inputValue]);

    const pin = (tag: string): void => {
        if (!selectedTags.includes(tag)) {
            let newPinnedTags = selectedTags;
            newPinnedTags.push(tag);
            setSelectedTags([...newPinnedTags].sort());
        }
    }

    const unPin = (tag: string): void => {
        let newPinnedTags = selectedTags.filter((curTag: string) => curTag !== tag);
        setSelectedTags([...newPinnedTags].sort());
    }
    return (

        <div className="tag-search">
            <div ref={input} className={classNames("tag-search-input-container", { 'remove-borders': showTags })}>
                <Icon className="tag-search-input-container-search-icon" icon="tabler:search" />
                <input

                    type='text'
                    placeholder='Search by tag…'
                    className={classNames("tag-search-input-container-input", { 'short': selectedTags.length > 0 })}
                    onKeyUp={(e) => {
                        setInputValue((e.target as HTMLInputElement).value)
                    }}
                ></input>
                {selectedTags.length > 0 && <div className="tag-search-input-container-tags-wrapper">
                    <div className="tag-search-input-container-tags"> {selectedTags.map((tag) => <Tag tag={tag} withActions={true} unPin={unPin} />)}</div>
                </div>}
                <button type='button' className='tag-search-input-container-button' onClick={() => {
                    setShowTags(!showTags)
                    setTags(sortTagsBySearch(props.tags, inputValue));
                }}>
                    <Icon className={classNames("tag-search-input-container-button-icon", { 'active': showTags })} icon="ic:round-keyboard-arrow-down" />
                </button>
            </div>
            {showTags && <div className="tags-wrapper"><div ref={tagsWrapper} className="tag-search-tags">
                {tags.map((tag) => <Tag tag={tag} withActions={true} pin={pin} />)}
            </div></div>}
        </div>
    )
};