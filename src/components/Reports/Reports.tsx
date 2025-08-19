import React, { useMemo, useState } from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	Grid,
	Button,
	TextField,
	Alert,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip
} from '@mui/material';
import { SaveAlt, Assessment, Download } from '@mui/icons-material';
import {
	useUserProfile,
	useWorkoutHistory,
	useNutritionLog,
	useSleepLog,
	useProgressHistory
} from '../../store/useAppStore';

function formatDate(d: Date | string): string {
	const date = typeof d === 'string' ? new Date(d) : d;
	return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function toCsv(headers: string[], rows: (string | number | null | undefined)[][]): string {
	const esc = (v: any) => {
		if (v === null || v === undefined) return '';
		const s = String(v);
		if (s.includes(',') || s.includes('"') || s.includes('\n')) {
			return '"' + s.replace(/"/g, '""') + '"';
		}
		return s;
	};
	return [headers.join(','), ...rows.map(r => r.map(esc).join(','))].join('\n');
}

const Reports: React.FC = () => {
	const userProfile = useUserProfile();
	const workouts = useWorkoutHistory();
	const nutrition = useNutritionLog();
	const sleep = useSleepLog();
	const progress = useProgressHistory();
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');

	const inRange = (date: Date) => {
		const ts = date.getTime();
		const after = startDate ? ts >= new Date(startDate).getTime() : true;
		const before = endDate ? ts <= new Date(endDate).getTime() + 24*60*60*1000 - 1 : true;
		return after && before;
	};

	const filtered = {
		workouts: useMemo(() => workouts.filter(w => inRange(new Date(w.date))), [workouts, startDate, endDate]),
		nutrition: useMemo(() => nutrition.filter(n => inRange(new Date(n.date))), [nutrition, startDate, endDate]),
		sleep: useMemo(() => sleep.filter(s => inRange(new Date(s.date))), [sleep, startDate, endDate]),
		progress: useMemo(() => progress.filter(p => inRange(new Date(p.date))), [progress, startDate, endDate])
	};

	const handleExportCSV = (kind: 'workouts' | 'nutrition' | 'sleep' | 'progress') => {
		let csv = '';
		if (kind === 'workouts') {
			csv = toCsv(
				['date', 'num_exercises', 'num_accessories', 'notes'],
				filtered.workouts.map((w: any) => [
					formatDate(w.date),
					w.exercises ? w.exercises.length : 0,
					w.accessories ? w.accessories.length : 0,
					w.notes || ''
				])
			);
		}
		if (kind === 'nutrition') {
			csv = toCsv(
				['date', 'meal', 'kcal', 'protein_g', 'carbs_g', 'fat_g', 'fiber_g'],
				filtered.nutrition.map((n: any) => [
					formatDate(n.date),
					n.meal,
					n.totalCalories,
					n.macros?.protein_g ?? 0,
					n.macros?.carbs_g ?? 0,
					n.macros?.fat_g ?? 0,
					n.macros?.fiber_g ?? 0
				])
			);
		}
		if (kind === 'sleep') {
			csv = toCsv(
				['date', 'sleep_hours', 'sleep_quality', 'stress_level', 'caffeine_intake', 'notes'],
				filtered.sleep.map((s: any) => [
					formatDate(s.date),
					s.sleepHours,
					s.sleepQuality,
					s.stressLevel,
					s.caffeineIntake,
					s.notes || ''
				])
			);
		}
		if (kind === 'progress') {
			csv = toCsv(
				['date', 'weight_lbs', 'body_fat_%', 'bench', 'squat', 'deadlift', 'ohp', 'rows', 'notes'],
				filtered.progress.map((p: any) => [
					formatDate(p.date),
					p.weight,
					p.bodyFatPercentage,
					p.strengthLifts?.benchPress ?? '',
					p.strengthLifts?.squat ?? '',
					p.strengthLifts?.deadlift ?? '',
					p.strengthLifts?.overheadPress ?? '',
					p.strengthLifts?.rows ?? '',
					p.notes || ''
				])
			);
		}
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `scioptimal_${kind}_${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleExportJSON = () => {
		const json = JSON.stringify({
			user: userProfile,
			startDate,
			endDate,
			workouts: filtered.workouts,
			nutrition: filtered.nutrition,
			sleep: filtered.sleep,
			progress: filtered.progress
		}, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `scioptimal_report_${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<Box>
			<Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
				Reports
			</Typography>

			{userProfile?.name?.toLowerCase() !== 'devin' && (
				<Alert severity="info" sx={{ mb: 2 }}>
					This report reflects the current profile data. When Devin tests, ask him to use the same device/profile named "Devin" so his entries appear here. He can also export and share JSON/CSV below.
				</Alert>
			)}

			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Grid container spacing={2} alignItems="center">
						<Grid item xs={12} md={3}>
							<TextField
								label="Start Date"
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								InputLabelProps={{ shrink: true }}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<TextField
								label="End Date"
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								InputLabelProps={{ shrink: true }}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} md={6} sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
							<Button variant="outlined" startIcon={<Download />} onClick={() => handleExportJSON()}>
								Export All (JSON)
							</Button>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Card>
						<CardContent>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
								<Typography variant="h6" sx={{ fontWeight: 600 }}>Workouts</Typography>
								<Button size="small" variant="outlined" startIcon={<SaveAlt />} onClick={() => handleExportCSV('workouts')}>Export CSV</Button>
							</Box>
							<TableContainer component={Paper}>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell>Date</TableCell>
											<TableCell>Exercises</TableCell>
											<TableCell>Accessories</TableCell>
											<TableCell>Notes</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{filtered.workouts.map((w: any, idx: number) => (
											<TableRow key={idx}>
												<TableCell>{formatDate(w.date)}</TableCell>
												<TableCell>{w.exercises ? w.exercises.length : 0}</TableCell>
												<TableCell>{w.accessories ? w.accessories.length : 0}</TableCell>
												<TableCell>{w.notes || ''}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12}>
					<Card>
						<CardContent>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
								<Typography variant="h6" sx={{ fontWeight: 600 }}>Nutrition</Typography>
								<Button size="small" variant="outlined" startIcon={<SaveAlt />} onClick={() => handleExportCSV('nutrition')}>Export CSV</Button>
							</Box>
							<TableContainer component={Paper}>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell>Date</TableCell>
											<TableCell>Meal</TableCell>
											<TableCell>Kcal</TableCell>
											<TableCell>Protein (g)</TableCell>
											<TableCell>Carbs (g)</TableCell>
											<TableCell>Fat (g)</TableCell>
											<TableCell>Fiber (g)</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{filtered.nutrition.map((n: any, idx: number) => (
											<TableRow key={idx}>
												<TableCell>{formatDate(n.date)}</TableCell>
												<TableCell><Chip size="small" label={n.meal} /></TableCell>
												<TableCell>{n.totalCalories}</TableCell>
												<TableCell>{n.macros?.protein_g ?? 0}</TableCell>
												<TableCell>{n.macros?.carbs_g ?? 0}</TableCell>
												<TableCell>{n.macros?.fat_g ?? 0}</TableCell>
												<TableCell>{n.macros?.fiber_g ?? 0}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12}>
					<Card>
						<CardContent>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
								<Typography variant="h6" sx={{ fontWeight: 600 }}>Sleep</Typography>
								<Button size="small" variant="outlined" startIcon={<SaveAlt />} onClick={() => handleExportCSV('sleep')}>Export CSV</Button>
							</Box>
							<TableContainer component={Paper}>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell>Date</TableCell>
											<TableCell>Sleep (hrs)</TableCell>
											<TableCell>Quality (1-10)</TableCell>
											<TableCell>Stress (1-10)</TableCell>
											<TableCell>Caffeine (hrs before)</TableCell>
											<TableCell>Notes</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{filtered.sleep.map((s: any, idx: number) => (
											<TableRow key={idx}>
												<TableCell>{formatDate(s.date)}</TableCell>
												<TableCell>{s.sleepHours}</TableCell>
												<TableCell>{s.sleepQuality}</TableCell>
												<TableCell>{s.stressLevel}</TableCell>
												<TableCell>{s.caffeineIntake}</TableCell>
												<TableCell>{s.notes || ''}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12}>
					<Card>
						<CardContent>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
								<Typography variant="h6" sx={{ fontWeight: 600 }}>Progress</Typography>
								<Button size="small" variant="outlined" startIcon={<SaveAlt />} onClick={() => handleExportCSV('progress')}>Export CSV</Button>
							</Box>
							<TableContainer component={Paper}>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell>Date</TableCell>
											<TableCell>Weight (lbs)</TableCell>
											<TableCell>Body Fat (%)</TableCell>
											<TableCell>Bench</TableCell>
											<TableCell>Squat</TableCell>
											<TableCell>Deadlift</TableCell>
											<TableCell>OHP</TableCell>
											<TableCell>Rows</TableCell>
											<TableCell>Notes</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{filtered.progress.map((p: any, idx: number) => (
											<TableRow key={idx}>
												<TableCell>{formatDate(p.date)}</TableCell>
												<TableCell>{p.weight}</TableCell>
												<TableCell>{p.bodyFatPercentage}</TableCell>
												<TableCell>{p.strengthLifts?.benchPress ?? ''}</TableCell>
												<TableCell>{p.strengthLifts?.squat ?? ''}</TableCell>
												<TableCell>{p.strengthLifts?.deadlift ?? ''}</TableCell>
												<TableCell>{p.strengthLifts?.overheadPress ?? ''}</TableCell>
												<TableCell>{p.strengthLifts?.rows ?? ''}</TableCell>
												<TableCell>{p.notes || ''}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Reports;
