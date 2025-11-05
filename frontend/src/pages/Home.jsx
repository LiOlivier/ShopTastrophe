import "./Home.css";
import HomeCategoryGrid from "../components/HomeCategoryGrid";
import { Link } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
	const { t } = useTranslation();
	const { language } = useLanguage();
	
	return (
		<>
			<div className="home-blank">
				<div className="home-footer">
					<div className="home-actions">
									<Link className="home-cta" to="/products">
										<span className="label">{t('home.shopNow').toUpperCase()}</span>
										<span className="arrow" aria-hidden>→</span>
									</Link>
					</div>
				</div>
			</div>
			<section className="home-cat-wrap">
				<HomeCategoryGrid />
			</section>
		</>
	);
}

