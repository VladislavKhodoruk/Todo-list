import instagramIcon from '../../assets/instagramIcon.svg';
import linkedinIcon from '../../assets/linkedinIcon.svg';
import vkIcon from '../../assets/vkIcon.svg'
import './Footer.scss';


export const Footer = () => (
    <div className='footer'>
        <p>© 2023 Vladislav Khodoruk. All rights reserved.</p>
        <div>
            <a href='https://www.instagram.com/vladislav_khodoruk/' target='_blank'><img src={instagramIcon} alt='Instagram' /></a>
            <a href='https://vk.com/squonky' target='_blank'><img src={vkIcon} alt='VK' /></a>
            <a href='https://www.linkedin.com/in/vladislav-khodoruk/' target='_blank'><img src={linkedinIcon} alt='LinkedIn' /></a>
        </div>
    </div>
);
