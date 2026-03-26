import Image from 'next/image';
import Link from 'next/link';
import '../../public/styles/styles.css';

export default function Banner({ image, alt, title, link }) {
    return (
        <Link href={link}>
            <div className={styles.banner}>
                {/* Banner Image */}
                <Image
                    src={image}
                    alt={alt}
                    width={1200}
                    height={400}
                    className={styles.bannerImage}
                    priority
                />
                {/* Banner Text */}
                <div className={styles.bannerText}>
                    {title}
                </div>
            </div>
        </Link>
    );
}
