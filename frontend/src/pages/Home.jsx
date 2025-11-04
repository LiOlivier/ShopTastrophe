import "./Home.css";
import HomeCategoryGrid from "../components/HomeCategoryGrid";
import { Link } from "react-router-dom";

export default function Home() {
	return (
		<>
			<div className="home-blank">
				<div className="home-footer">
					<div className="home-actions">
									<Link className="home-cta" to="/products">
										<span className="label">DÉCOUVRIR LA COLLECTION</span>
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

