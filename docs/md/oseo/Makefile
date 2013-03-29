all: concat pdf

concat:
	cat presentation/resume_exec.md presentation/besoins.md presentation/description_solution.md presentation/description_technique.md marketing/marche.md marketing/plan_marketing.md marketing/finance.md previsionnel/management_projet.md previsionnel/licence.md previsionnel/risques.md previsionnel/evolutions.md annexes/lots.md annexes/liste_fonctionnalites.md annexes/business_model_canvas.md > oseo.md

pdf: concat
	cd .. && ./md2pdf oseo/oseo.md && rm oseo/oseo.md && cd oseo

clean:
	if [ -e oseo.md ]; then rm oseo.md; elif [ -e ../../pdf/oseo/oseo.pdf ]; then rm ../../pdf/oseo/oseo.pdf; fi

