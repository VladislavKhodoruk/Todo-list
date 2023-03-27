import { Icon } from '@iconify/react';
import classNames from 'classnames';
import './Tag.scss';

export const Tag = (props: { tag: string, withActions?: boolean, unPin?: (tag: string) => void, pin?: (tag: string) => void }) => {
    return (
        <>{props.withActions ? <div
            onClick={() => {
                if (props.pin) {
                    props.pin!(props.tag)!
                }
            }}
            className={classNames('tag', 'with-close-button')}
        >
            <p>{props.tag}</p>
            {props.unPin && <button type='button'
                className='tag-button'
                onClick={(e) => {
                    props.unPin!(props.tag)!
                    e.stopPropagation()

                }}>
                <Icon className='tag-button-icon' icon="maki:cross" />
            </button>}

        </div> :
            <div className='tag' >
                <p>{props.tag}</p>
            </div>
        }</>

    )
};
