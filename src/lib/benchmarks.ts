// This is mock data for demonstration purposes.
// In a real application, this would be fetched from a secure database.

type Test = 'jump-height' | 'sit-ups' | 'run-time' | 'squats' | 'lunges' | 'push-ups';
type Gender = 'male' | 'female';

export type BenchmarkZones = {
  red: { y1: number | 'dataMin' | 'dataMax', y2: number | 'dataMin' | 'dataMax' },
  orange: { y1: number, y2: number },
  green: { y1: number | 'dataMin' | 'dataMax', y2: number | 'dataMin' | 'dataMax' }
}

// Data structure: test -> gender -> ageGroup -> [p10, p25, p50, p75, p90]
const benchmarkData = {
  "jump-height": {
    male: {
      "10-15": [0.30, 0.35, 0.42, 0.50, 0.58], // meters
      "16-20": [0.40, 0.48, 0.55, 0.65, 0.75],
      "21-30": [0.45, 0.52, 0.60, 0.70, 0.80],
      "31-40": [0.38, 0.45, 0.50, 0.58, 0.65],
    },
    female: {
      "10-15": [0.25, 0.30, 0.35, 0.42, 0.48],
      "16-20": [0.32, 0.38, 0.45, 0.52, 0.60],
      "21-30": [0.35, 0.41, 0.48, 0.55, 0.62],
      "31-40": [0.30, 0.35, 0.40, 0.46, 0.52],
    },
  },
  "sit-ups": { // reps in 1 minute
    male: {
      "10-15": [25, 30, 38, 45, 52],
      "16-20": [35, 42, 50, 58, 65],
      "21-30": [40, 48, 55, 63, 70],
      "31-40": [35, 40, 48, 55, 62],
    },
    female: {
      "10-15": [22, 28, 35, 42, 48],
      "16-20": [30, 38, 45, 53, 60],
      "21-30": [35, 42, 50, 58, 65],
      "31-40": [30, 35, 42, 48, 55],
    },
  },
  "run-time": { // 40-yard dash in seconds (lower is better)
    male: {
      "10-15": [6.0, 5.7, 5.4, 5.1, 4.9],
      "16-20": [5.5, 5.2, 4.9, 4.7, 4.5],
      "21-30": [5.3, 5.0, 4.8, 4.6, 4.4],
      "31-40": [5.6, 5.3, 5.1, 4.9, 4.7],
    },
    female: {
      "10-15": [6.5, 6.2, 5.9, 5.6, 5.3],
      "16-20": [6.0, 5.7, 5.4, 5.2, 5.0],
      "21-30": [5.8, 5.5, 5.3, 5.1, 4.9],
      "31-40": [6.2, 5.9, 5.6, 5.4, 5.2],
    },
  },
  "squats": { // reps in 1 minute
    male: {
      "10-15": [20, 28, 35, 42, 50],
      "16-20": [30, 40, 50, 60, 70],
      "21-30": [35, 45, 55, 65, 75],
      "31-40": [28, 38, 48, 58, 65],
    },
    female: {
      "10-15": [18, 25, 32, 40, 48],
      "16-20": [25, 35, 45, 55, 65],
      "21-30": [30, 40, 50, 60, 70],
      "31-40": [25, 35, 45, 55, 62],
    },
  },
  "lunges": { // reps per leg in 1 minute
    male: {
      "10-15": [15, 20, 25, 30, 35],
      "16-20": [20, 25, 30, 38, 45],
      "21-30": [22, 28, 35, 42, 50],
      "31-40": [18, 24, 30, 36, 42],
    },
    female: {
      "10-15": [12, 18, 22, 28, 32],
      "16-20": [18, 22, 28, 35, 40],
      "21-30": [20, 25, 30, 38, 45],
      "31-40": [15, 20, 25, 32, 38],
    },
  },
    "push-ups": { // reps in 1 minute
    male: {
      "10-15": [10, 15, 22, 30, 40],
      "16-20": [18, 25, 35, 45, 55],
      "21-30": [20, 30, 40, 50, 60],
      "31-40": [15, 22, 30, 40, 50],
    },
    female: { // Often done on knees, but standards vary. Assuming standard form for athletes.
      "10-15": [5, 10, 15, 20, 25],
      "16-20": [10, 15, 22, 28, 35],
      "21-30": [12, 18, 25, 33, 40],
      "31-40": [8, 14, 20, 26, 32],
    },
  },
};

const getAgeGroup = (age: number): string => {
  if (age >= 10 && age <= 15) return "10-15";
  if (age >= 16 && age <= 20) return "16-20";
  if (age >= 21 && age <= 30) return "21-30";
  if (age >= 31 && age <= 40) return "31-40";
  throw new Error("Age out of range");
};

const percentiles = [10, 25, 50, 75, 90];

export const getBenchmark = (test: Test, age: number, gender: Gender, value: number) => {
  const ageGroup = getAgeGroup(age);
  const data = benchmarkData[test][gender][ageGroup];
  const medianValue = data[2]; // p50

  const isLowerBetter = test === 'run-time';

  // Find where the value fits
  let percentile = 0;
  if (isLowerBetter) {
    if (value >= data[0]) percentile = 10;
    else if (value < data[4]) percentile = 95; // Top 5%
    else {
      for (let i = data.length - 1; i >= 0; i--) {
        if (value < data[i]) {
          const lowerBound = i < 4 ? data[i+1] : value;
          const upperBound = data[i];
          const lowerPerc = i < 4 ? percentiles[i+1] : 90;
          const upperPerc = percentiles[i];

          const range = lowerBound - upperBound;
          const pos = value - upperBound;
          percentile = upperPerc + (pos / range) * (lowerPerc - upperPerc);

          break;
        }
      }
    }
  } else {
    if (value <= data[0]) percentile = 10;
    else if (value > data[4]) percentile = 95; // Top 5%
    else {
        for (let i = 0; i < data.length; i++) {
            if (value <= data[i]) {
                const lowerBound = i > 0 ? data[i-1] : 0;
                const upperBound = data[i];
                const lowerPerc = i > 0 ? percentiles[i-1] : 0;
                const upperPerc = percentiles[i];
                
                const range = upperBound - lowerBound;
                const pos = value - lowerBound;
                percentile = lowerPerc + (pos/range) * (upperPerc-lowerPerc);

                break;
            }
        }
    }
  }


  return {
    value: medianValue,
    percentile: Math.round(percentile),
  };
};

export const getBenchmarkZones = (test: Test, age: number, gender: Gender): BenchmarkZones | undefined => {
    try {
        const ageGroup = getAgeGroup(age);
        const data = benchmarkData[test][gender][ageGroup];
        const p25 = data[1];
        const p75 = data[3];

        const isLowerBetter = test === 'run-time';

        if (isLowerBetter) {
            return {
                red: { y1: p25, y2: 'dataMax' },
                orange: { y1: p75, y2: p25 },
                green: { y1: 'dataMin', y2: p75 },
            }
        } else {
            return {
                red: { y1: 'dataMin', y2: p25 },
                orange: { y1: p25, y2: p75 },
                green: { y1: p75, y2: 'dataMax' },
            }
        }
    } catch (e) {
        console.error("Could not get benchmark zones", e);
        return undefined;
    }
}
