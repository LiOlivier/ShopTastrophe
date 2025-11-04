import "./Home.css";
import HomeCategoryGrid from "../components/HomeCategoryGrid";

export default function Home() {
	return (
		<>
			<div className="home-blank">
				<div className="home-footer">
					<div className="home-actions">
						<div className="home-cta" role="button" tabIndex={0}>
							<span className="label">DÉCOUVRIR LA COLLECTION</span>
							<span className="arrow" aria-hidden>→</span>
						</div>
					</div>
				</div>
			</div>
			<section className="home-cat-wrap">
				<HomeCategoryGrid />
			</section>
		</>
	);
}

